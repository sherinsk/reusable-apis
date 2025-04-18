const db=require('../config/database')
const ExcelJS = require('exceljs');

const controller = {

    async downloadExcel(req, res) {
        try {
          // Set response headers
          res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
          res.setHeader('Content-Disposition', 'attachment; filename=UserData.xlsx');
      
          // Create a streaming Excel workbook
          const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({ stream: res });
          const worksheet = workbook.addWorksheet('User Data');
      
          const stream = db('User').select('*').stream();
      
          let headerWritten = false;
          let rowCount = 0;
      
          stream.on('data', (row) => {
            if (!headerWritten) {
              worksheet.columns = Object.keys(row).map((key) => ({
                header: key,
                key,
                width: 20,
              }));
              headerWritten = true;
            }
      
            worksheet.addRow(row).commit();
            rowCount++;
          });
      
          stream.on('end', async () => {
            await worksheet.commit();
            await workbook.commit();
            console.log(`✅ Excel export finished. Rows written: ${rowCount}`);
          });
      
          stream.on('error', (err) => {
            console.error('❌ Stream error:', err);
            if (!res.headersSent) {
              res.status(500).send('Stream error while exporting Excel');
            }
          });
        } catch (err) {
          console.error('❌ Excel generation error:', err);
          if (!res.headersSent) {
            res.status(500).json({ message: 'Internal Server Error' });
          }
        }
      },
    


    // async downloadExcel(req, res) {
    //     try {
    //       // Create Excel workbook and worksheet
    //       const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({
    //         stream: res,
    //       });
      
    //       const worksheet = workbook.addWorksheet('Users Data');
      
    //       // Set headers for download
    //       res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    //       res.setHeader('Content-Disposition', 'attachment; filename=UsersData.xlsx');
      
    //       let offset = 0; // Start from the first row
    //       const chunkSize = 1000; // Chunk size for fetching data
    //       let chunkCount = 0;
      
    //       console.log('Starting data streaming...');
      
    //       // Fetch the first chunk to dynamically set columns based on the first row
    //       const firstChunk = await db('User').select().limit(1); // Get the first row
    //       if (firstChunk.length === 0) {
    //         return res.status(404).json({ message: 'No data found' });
    //       }
      
    //       // Dynamically set columns based on the first row keys (column names)
    //       const columns = Object.keys(firstChunk[0]).map(key => ({
    //         header: key,
    //         key: key,
    //         width: 20, // Set default width for each column
    //       }));
      
    //       worksheet.columns = columns; // Set the worksheet columns dynamically
      
    //       while (true) {
    //         // Fetch data in chunks using LIMIT and OFFSET
    //         const data = await db('User')
    //           .select() // Fetch all columns
    //           .limit(chunkSize)
    //           .offset(offset); // Implement pagination using OFFSET
      
    //         console.log(`Processing chunk ${++chunkCount}, rows: ${data.length}`);
      
    //         if (data.length === 0) {
    //           break; // Exit the loop if no more data is fetched
    //         }
      
    //         // Add data rows to the Excel file
    //         data.forEach((row) => {
    //           worksheet.addRow(row).commit(); // Write each row and commit immediately
    //         });
      
    //         // Update the offset to get the next chunk of data
    //         offset += chunkSize;
    //       }
      
    //       console.log('Finalizing workbook...');
    //       await workbook.commit(); // Finalize and commit the Excel file
      
    //       console.log('Excel file generation completed.');
    //     } catch (err) {
    //       console.error('Excel generation error:', err);
    //       res.status(500).json({ message: 'Internal Server Error' });
    //     }
    //   },



    async getData(req, res) {
        try {
          // Fetch the first row of data from the 'User' table (you can change the table name as per your use case)
          const firstRow = await db('User').select('*').first();
      
          // Check if data was found
          if (!firstRow) {
            return res.status(404).json({ message: 'No data found' });
          }
      
          // Send the first row as the response
          res.status(200).json(firstRow);
        } catch (error) {
          // Handle any errors that occur during the query
          console.error('Error fetching data:', error);
          res.status(500).json({ message: 'Internal Server Error' });
        }
      }
      
  };
  
module.exports=controller;