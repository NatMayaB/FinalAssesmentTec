import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';  // Import the useTranslation hook
import { CCard, CCardBody, CCol, CRow, CFormSelect, CFormInput, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CFormCheck, CButton } from '@coreui/react';
import logo from '../../assets/images/logo.png'; // Import the logo image
import CryptoJS from 'crypto-js';
import generateHmacSignature from '../../assets/generateHmacSignature';

//create the dashboard component
const Dashboard = () => {
  const { t } = useTranslation();  // Access the t function to translate text
  // Define the state variables, set the default values
  const [startTime, setStartTime] = useState('08:00 AM');
  const [endTime, setEndTime] = useState('05:00 PM');
  const [employees, setEmployees] = useState(10);
  const [dailySales, setSales] = useState(1000);
  const [hourlySales, setHourlySales] = useState({});  
  const [breaks, setBreaks] = useState({});  
  const [submissionMessage, setSubmissionMessage] = useState('');  

  // Define the available times in 12-hour format, that will be used in the dropdown menu
  const times = [
    '12:00 AM', '01:00 AM', '02:00 AM', '03:00 AM', '04:00 AM', '05:00 AM', '06:00 AM',
    '07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM',
    '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM',
    '09:00 PM', '10:00 PM', '11:00 PM'
  ];
  // Function to convert the time to a number for comparison, used to filter the end times
  const convertToNumber = (time) => {
    const [hours, minutes] = time.split(':');
    const period = time.slice(-2);
    let hourNum = parseInt(hours);

    if (period === 'PM' && hourNum !== 12) {
      hourNum += 12;
    } else if (period === 'AM' && hourNum === 12) {
      hourNum = 0;
    }

    return hourNum * 100 + parseInt(minutes.slice(0, 2));
  };

  // Filter the end times based on the selected start time
  const filteredEndTimes = times.filter(time => convertToNumber(time) > convertToNumber(startTime));

  const selectedHours = times.filter(
    (time) => convertToNumber(time) >= convertToNumber(startTime) && convertToNumber(time) <= convertToNumber(endTime)
  );

  // Function to handle changes in hourly sales for the future table
  const handleHourlySalesChange = (hour, value) => {
    setHourlySales((prevSales) => ({
      ...prevSales,
      [hour]: value,
    }));
  };
// Function to handle changes in the break status
  const handleBreakChange = (hour, isChecked) => {
    setBreaks((prevBreaks) => ({
      ...prevBreaks,
      [hour]: isChecked,
    }));

    // If checked, set sales to 0
    if (isChecked) {
      setHourlySales((prevSales) => ({
        ...prevSales,
        [hour]: 0,
      }));
    }
  };

//Function to manage the data and their submission

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submission
  
    const secretKey = 'BagvFPQmNlG3JyfY9iXiBcweGJ55/byjrqXEz55OpBQ='; // Secrect key from the app.py
  
    // Convert the entry timestamp to a compatible format
    //The entrytimestamp is the current date of when the submission is made
    const entryTimestampFormatted = new Date().toISOString().slice(0, 10); 
    //console.log('Entry Timestamp:', entryTimestampFormatted);

    //Function to convert the time to 24-hour format
    const convertTo24Hour = (time) => {
      const [timePart, modifier] = time.split(' ');
      let [hours, minutes] = timePart.split(':');
      if (modifier === 'PM' && hours !== '12') {
        hours = parseInt(hours, 10) + 12;
      }
      if (modifier === 'AM' && hours === '12') {
        hours = '00';
      }
      return `${hours}:${minutes}:00`; // Return in HH:MM:SS format
    };
    
    // Convert the opening and closing times to 24-hour format
    const openingTime24 = convertTo24Hour(startTime);
    const closingTime24 = convertTo24Hour(endTime);
  
    // Prepare the client data for submission
    const clientData = [
      {
          "entry_timestamp": entryTimestampFormatted,
          "employees": employees,
          "daily_sales": dailySales,
          "opening_time": openingTime24,
          "closing_time": closingTime24
      }
  ];
    //Start to submit the data to the API
    try {
      // Generate a timestamp
      const timestamp = Math.floor(Date.now() / 1000);
      //console.log('Timestamp:', timestamp);

      // Generate HMAC signature
      const payload = JSON.stringify(clientData);
      const hmacSignature = generateHmacSignature('POST', '/clients/batch', timestamp, payload);
      //console.log('HMAC Signature:', hmacSignature);

      // Submit client data to EC2 API
      const response = await fetch('http://34.238.138.8:5000/clients/batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Signature': hmacSignature, // Add HMAC signature to headers
          'X-Timestamp': timestamp,    // Add timestamp to headers
        },
        body: payload,
      });
  
      if (!response.ok) {
        throw new Error('Failed to submit client data');//Throw an error if the submission fails
      }
      //const responseData = await response.json();
      //console.log("API response for client batch:", responseData);

      
      //GET all the info from /clients
      const hmacGET = generateHmacSignature('GET', '/clients', timestamp, '');
      const clientResponse = await fetch('http://34.238.138.8:5000/clients', {
        method: 'GET',
        headers: {
          'X-Signature': hmacGET, // Add HMAC signature to headers
          'X-Timestamp': timestamp,    // Add timestamp to headers
        },
      });

      //print the GET response
      console.log("API response for client batch:", clientResponse);

      //GET the daily_data_id from the response
      const clientDataResponse = await clientResponse.json();
      const dailyDataId = clientDataResponse[0].daily_data_id;
      console.log("Daily Data ID:", dailyDataId);

      //GET the last daily_data_id from the response
      const lastDailyDataId = clientDataResponse[clientDataResponse.length - 1].daily_data_id;
      console.log("Last Daily Data ID:", lastDailyDataId);

  
      // Prepare hourly sales data using the returned daily_data_id
      const hourlySalesData = Object.entries(hourlySales).map(([hour, hourlySalesValue]) => ({
      daily_data_id: lastDailyDataId, // Use the ID obtained from /clients/batch
      hourly_timestamp: convertTo24Hour(hour), // Convert to HH:MM:SS format
      hourly_sales: parseFloat(hourlySalesValue).toFixed(2), // Convert to number and format with 2 decimal places
      breaks: Boolean(breaks[hour]), // Ensure boolean value for breaks
      }));

      const hourlyPayload = JSON.stringify(hourlySalesData);
      // Generate HMAC for hourly sales data
      const hourlyHmac = generateHmacSignature('POST', '/hourly_sales/batch', timestamp, hourlyPayload);
      // Submit hourly sales data
      const hourlyResponse = await fetch('http://34.238.138.8:5000/hourly_sales/batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Signature': hourlyHmac,
          'X-Timestamp': timestamp,
        },
        body: hourlyPayload,
      });
  
      if (!hourlyResponse.ok) {
        throw new Error('Failed to submit hourly sales data');//Throw an error if the submission fails
      }
  
      console.log('Data submitted successfully!'); // Log a success message if all data is submitted successfully
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  
  // Render the dashboard UI ---------------------------------------------
  return (
    <div>
      <CRow>
        <CCol xs={12}>
          <CCard>
            <CCardBody className="text-center">
              <h1>{t('clientDataUI')}</h1> {/* Translate the heading */}
              <p>{t('welcomeMessage')}</p> {/* Translate the welcome message */}

              <div className="mt-4">
                <h5>{t('selectOperatingHours')}</h5> {/* Translate the subheading */}
                <CRow className="justify-content-center mt-3">
                  <CCol xs={4}>
                    <CFormSelect
                      value={startTime} // Set the value of the select element
                      onChange={(e) => setStartTime(e.target.value)} // Handle changes so the value is updated
                    >
                      {times.map((time, index) => (
                        <option key={index} value={time}>
                          {time}
                        </option>
                      ))}
                    </CFormSelect>
                  </CCol>
                  <CCol xs={4}>
                    <CFormSelect
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      disabled={filteredEndTimes.length === 0} // Disable the select if there are no available times
                    >
                      {filteredEndTimes.length > 0 ? (
                        filteredEndTimes.map((time, index) => ( // Map the filtered times to options
                          <option key={index} value={time}>
                            {time}
                          </option>
                        ))
                      ) : (
                        <option>{t('noAvailableTimes')}</option> // Display a message if there are no available times
                      )}
                    </CFormSelect>
                  </CCol>
                </CRow>
                <div className="mt-4">
                  <p>{t('operatingHours')}: {startTime} - {endTime}</p> {/* Display the selected operating hours */}
                </div>
              </div>

              <div className="mt-4">
                <h5>{t('enterDailyMetrics')}</h5>
                <CRow className="justify-content-center mt-3">
                  <CCol xs={4}>
                    <label htmlFor="employees">{t('numberOfEmployees')}</label> {/* Translate the label */}
                    <CFormInput
                      type="number"
                      id="employees"
                      value={employees} // Set the value of the input
                      onChange={(e) => setEmployees(e.target.value)} // Handle changes to update the value
                      min="1"
                    />
                  </CCol>
                  <CCol xs={4}>
                    <label htmlFor="sales">{t('dailySales')}</label>
                    <CFormInput
                      type="number"
                      id="sales"
                      value={dailySales} // Set the value of the input
                      onChange={(e) => setSales(e.target.value)} // Handle changes to update the value
                      min="0"
                    />
                  </CCol>
                </CRow>
                <div className="mt-4">
                  <p>{t('employees')}: {employees}</p> {/* Display the number of employees */}
                  <p>{t('dailySales')}: ${dailySales}</p> {/* Display the daily sales */}
                </div>
              </div>

              <div className="mt-4">
                <h5>{t('salesPerHour')}</h5> {/* Translate the subheading */}
                <CTable responsive> {/* Create a responsive table */}
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>{t('hour')}</CTableHeaderCell>
                      <CTableHeaderCell>{t('sales')}</CTableHeaderCell>
                      <CTableHeaderCell>{t('inBreak')}</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {selectedHours.map((hour, index) => ( // Map the selected hours to table rows
                      <CTableRow key={index}>
                        <CTableDataCell>{hour}</CTableDataCell>
                        <CTableDataCell>
                          <CFormInput // Create an input field for sales
                            type="number"
                            placeholder={breaks[hour] ? '0' : t('enterSales')}
                            value={breaks[hour] ? 0 : hourlySales[hour] || ''}
                            onChange={(e) => handleHourlySalesChange(hour, e.target.value)}
                            min="0"
                            disabled={breaks[hour]} // Disable input if break is checked
                          />
                        </CTableDataCell>
                        <CTableDataCell>
                          <CFormCheck
                            id={`break-${index}`}
                            checked={breaks[hour] || false}
                            onChange={(e) => handleBreakChange(hour, e.target.checked)}
                          />
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              </div>

              <div className="mt-4">
                <CButton onClick={handleSubmit} color="primary">{t('submit')}</CButton> {/* Translate the button text */}
                {submissionMessage && <p>{submissionMessage}</p>}
              </div>

              <CRow className="justify-content-end mt-4">
                <CCol xs={2} className="text-right">
                  <img
                    src={logo}
                    alt={t('companyLogo')} // Translate the alt text
                    style={{
                      width: '150px',
                      height: 'auto'
                    }}
                  />
                </CCol>
              </CRow>

              <CRow className="justify-content-end mt-5">
                <p>{t('privacyMessage')}</p> {/* Translate the privacy message */}
              </CRow>

            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  );
};
// Export the Dashboard component
export default Dashboard;

