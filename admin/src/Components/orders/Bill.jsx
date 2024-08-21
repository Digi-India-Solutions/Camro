import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import logo from './logo-main.png'; // Import the logo

// Styles for the PDF
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
    backgroundColor: '#f9f9f9',
  },
  container: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    maxWidth: '100%',
    flexDirection: 'column',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderBottom: '2px solid #ddd',
    paddingBottom: 10,
  },
  logo: {
    width: 120,
    height: 'auto',
  },
  companyDetails: {
    fontSize: 12,
    color: '#333',
    marginBottom: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  section: {
    marginBottom: 15,
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
    color: '#555',
  },
  strong: {
    fontWeight: 'bold',
  },
  table: {
    width: '100%',
    borderSpacing: 0,
    borderCollapse: 'collapse',
    marginBottom: 20,
  },
  tableRow: {
    display: 'table-row',
  },
  tableCell: {
    display: 'table-cell',
    padding: 8,
    border: '1px solid #ddd',
    fontSize: 12,
    color: '#555',
  },
  tableHeader: {
    backgroundColor: '#f4f4f4',
    fontWeight: 'bold',
    color: '#333',
  },
  userDetails: {
    marginTop: 10,
    fontSize: 12,
    color: '#555',
    borderTop: '1px solid #ddd',
    paddingTop: 10,
  },
  footer: {
    textAlign: 'center',
    fontSize: 12,
    color: '#555',
    marginTop: 20,
    borderTop: '1px solid #ddd',
    paddingTop: 10,
  },
});

const Bill = ({ order, user }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Image style={styles.logo} src={logo} />
          <View>
            <Text style={styles.title}>Invoice</Text>
            <Text style={styles.companyDetails}>Company Name: Camro</Text>
            <Text style={styles.companyDetails}>Address: C-60/2, Wazirpur Industrial Area, Delhi-110052</Text>
            <Text style={styles.companyDetails}>Contact Us: +91-8595722922</Text>
            <Text style={styles.companyDetails}>Email: sale.camrosteel@gmail.com</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={styles.text}><Text style={styles.strong}>Invoice ID:</Text> {order._id}</Text>
            <Text style={styles.text}><Text style={styles.strong}>Date:</Text> {new Date(order.createdAt).toLocaleDateString()}</Text>
          </View>
          <Text style={styles.text}><Text style={styles.strong}>Order Status:</Text> {order.orderStatus}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>Product Details</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={[styles.tableCell, styles.tableHeader]}><Text>Product Name</Text></View>
              <View style={[styles.tableCell, styles.tableHeader]}><Text>Quantity</Text></View>
              <View style={[styles.tableCell, styles.tableHeader]}><Text>Price</Text></View>
              <View style={[styles.tableCell, styles.tableHeader]}><Text>Total</Text></View>
            </View>
            {order.product.map((item, index) => (
              <View style={styles.tableRow} key={index}>
                <View style={styles.tableCell}><Text>{item.name}</Text></View>
                <View style={styles.tableCell}><Text>{item.quantity}</Text></View>
                <View style={styles.tableCell}><Text>Rs{item.price}</Text></View>
                <View style={styles.tableCell}><Text>Rs{item.price * item.quantity}</Text></View>
              </View>
            ))}
            <View style={styles.tableRow}>
              <View style={styles.tableCell} colSpan="3"><Text style={styles.strong}>Total Amount</Text></View>
              <View style={styles.tableCell}><Text style={styles.strong}>Rs{order.TotalAmount}</Text></View>
            </View>
          </View>
        </View>

        {user && (
          <View style={styles.userDetails}>
            <Text style={styles.title}>User Details</Text>
            <Text style={styles.text}><Text style={styles.strong}>Name:</Text> {user.Name}</Text>
            <Text style={styles.text}><Text style={styles.strong}>Email:</Text> {user.Email}</Text>
            <Text style={styles.text}><Text style={styles.strong}>Contact Number:</Text> {user.ContactNumber}</Text>
            <Text style={styles.text}><Text style={styles.strong}>Address:</Text> {order.address.map(addr => `${addr.street}, ${addr.city}, ${addr.state} - ${addr.pincode}`).join(', ')}</Text>
          </View>
        )}

        <View style={styles.footer}>
          <Text>Thank you for your business!</Text>
        </View>
      </View>
    </Page>
  </Document>
);

export default Bill;
