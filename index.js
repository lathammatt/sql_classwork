'use strict';

const { Database } = require('sqlite3').verbose();
const db = new Database('db/Chinook_Sqlite.sqlite')
const Table = require('cli-table')

// db.serialize(() => {
//   db.all(`
//   SELECT FirstName || " " || LastName AS "FullName",
//         CustomerId,
//         Country
//   FROM Customer
//   WHERE Country <> "USA"`,
//     (err, customers) => {
//       console.log(customers)
//     })

//   db.each(`
//     SELECT FirstName || ' ' || LastName AS 'Name',
//            CustomerId,
//            Country
//     FROM   Customer
//     WHERE  Country IS 'Brazil'
//   `, (err, { CustomerId, Name, Country }) => {
//     console.log(`${CustomerId}: ${Name} (${Country})`)
//   })

//   const head = ['InvoiceId', 'Name', 'InvoiceDate', 'BillingCountry']
//   const tbl = new Table({ head})

//   db.each(`
//     SELECT FirstName || " " || LastName AS "Name",
//            InvoiceId,
//            InvoiceDate,
//            BillingCountry
//     FROM   Invoice
//     JOIN   Customer
//     ON     Invoice.CustomerId = Customer.CustomerId
//     WHERE  Country = "Brazil"
//   `, (err, i) => {
//       tbl.push([i.InvoiceId, i.Name, i.InvoiceDate, i.BillingCountry])
//     }, () => console.log(tbl.toString())
//   )

//   const tbl4 = new Table({ head: ['Name'] , style : { compact : true } })

//   db.each(`
//     SELECT FirstName || " " || LastName AS "Name"
//     FROM   Employee
//     WHERE  Employee.Title = "Sales Support Agent"
//   `, (err, emp) => tbl4.push([emp.Name])
//   , () => console.log(tbl4.toString()))

// })

// db.close()

const knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: 'db/Chinook_Sqlite.sqlite',
  },
  useNullAsDefault: true,
})

knex('Invoice').distinct('BillingCountry').orderBy('BillingCountry').then(console.log)

knex('Invoice').where('BillingCountry', 'Brazil').then(console.log)

knex('Invoice').select('Invoice.Invoiceid').select(knex.raw('Employee.FirstName || " " || Employee.LastName AS "FullName"')).join('Customer', 'Invoice.CustomerId', 'Customer.Customerid').join('Employee', 'Customer.SupportRepId', 'Employee.Employeeid').then(console.log)

knex('Invoice')
  .select(knex.raw('Customer.FirstName || " " || Customer.LastName AS "Customer Name"'))
  .select('Customer.Country')
  .select(knex.raw('Employee.FirstName || " " || Employee.LastName AS "Employee Name"'))
  .join('Customer', 'Invoice.CustomerId', 'Customer.Customerid')
  .join('Employee', 'Customer.SupportRepId', 'Employee.Employeeid')
  .sum('Invoice.Total as Total')
  .groupBy('Customer.FirstName')
  .then(console.log)




knex.destroy()