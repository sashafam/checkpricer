
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://uhsyzgmbvxjarwpntuod.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVoc3l6Z21idnhqYXJ3cG50dW9kIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODk0MjAwMTgsImV4cCI6MjAwNDk5NjAxOH0.sutBAJhAdkIps_zbymITysl3PtuAKJjFClkChV7xcEk'
const supabase = createClient(supabaseUrl, supabaseKey)

async function fetchData() {
    // Implement your logic to fetch the data you want to send
    // For example, you can query a database or fetch data from an API
    // Return the data as an array of objects
    return [
      { name: 'John', age: 30 },
      { name: 'Jane', age: 25 },
      // Add more data as needed
    ];
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
  
  // Call the function to send data whenever needed
  sendDataToSupabase();