const axios = require('axios');
const cheerio = require('cheerio');
const { createClient } = require('@supabase/supabase-js');

const url = 'https://www.suplementoscolombia.co/';
const supabaseUrl = 'https://uhsyzgmbvxjarwpntuod.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVoc3l6Z21idnhqYXJ3cG50dW9kIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODk0MjAwMTgsImV4cCI6MjAwNDk5NjAxOH0.sutBAJhAdkIps_zbymITysl3PtuAKJjFClkChV7xcEk'


const supabase = createClient(supabaseUrl, supabaseKey, {
    persistSession: false,
  });

async function fetchData() {
  const response = await axios.get(url);
  const html = response.data;
  const $ = cheerio.load(html);

  const linkslist = [];
  $('.submenu li a').each(function () {
    const link = $(this).attr('href');
    linkslist.push({ link: link });
  });

  const linkslist2 = [];
  for (const element of linkslist) {
    const productUrl2 = element.link;
    const productResponse2 = await axios.get(productUrl2);
    const productHtml2 = productResponse2.data;
    const product2$ = cheerio.load(productHtml2);
    product2$('.page-link').each(function () {
      const link = $(this).attr('href');
      linkslist2.push({ link: link });
    });
  }

  const filteredLinkslist2 = linkslist2.filter(item => item.link !== undefined);
  
  const linkslist3 = linkslist.concat(filteredLinkslist2);

 

  const productlist = [];
  for (const element of linkslist3) {
    const productUrl = element.link;
    const productResponse = await axios.get(productUrl);
    const productHtml = productResponse.data;
    const product$ = cheerio.load(productHtml);

    product$('.grid_item').each(function () {
      const name = product$(this).find('h3').text();
      const price = product$(this).find('span.new_price').text();

      productlist.push({
        name: name,
        price: price,
      });
    });
  }



  
  return productlist;

}


async function sendDataToSupabase() {
  try {
    const data = await fetchData();

    const { data: insertedData, error } = await supabase
      .from('Price')
      .insert(data);

    if (error) {
      console.error('Error inserting data:', error);
    } else {
      console.log('Data inserted successfully:', insertedData);
    }
  } catch (error) {
    console.error('Error sending data to Supabase:', error);
  }
}

// Call the function to send data to Supabase
sendDataToSupabase();

setInterval(sendDataToSupabase, 60 * 1000)