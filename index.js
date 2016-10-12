'use strict';

const { Database } = require('sqlite3').verbose();
const db = new Database('db/Chinook_Sqlite.sqlite')
const Table = require('cli-table')

db.serialize(() => {
  db.all(`
  SELECT FirstName || " " || LastName AS "FullName",
        CustomerId,
        Country
  FROM Customer
  WHERE Country <> "USA"`,
    (err, customers) => {
      console.log(customers)
    })

  db.each(`
    SELECT FirstName || ' ' || LastName AS 'Name',
           CustomerId,
           Country
    FROM   Customer
    WHERE  Country IS 'Brazil'
  `, (err, { CustomerId, Name, Country }) => {
    console.log(`${CustomerId}: ${Name} (${Country})`)
  })

  const head = ['InvoiceId', 'Name', 'InvoiceDate', 'BillingCountry']
  const tbl = new Table({ head})

  db.each(`
    SELECT FirstName || " " || LastName AS "Name",
           InvoiceId,
           InvoiceDate,
           BillingCountry
    FROM   Invoice
    JOIN   Customer
    ON     Invoice.CustomerId = Customer.CustomerId
    WHERE  Country = "Brazil"
  `, (err, i) => {
      tbl.push([i.InvoiceId, i.Name, i.InvoiceDate, i.BillingCountry])
    }, () => console.log(tbl.toString())
  )

  // 4. Provide a query showing only the Employees who are Sales Agents.
  const tbl4 = new Table({ head: ['Name'] , style : { compact : true } })

  db.each(`
    SELECT FirstName || " " || LastName AS "Name"
    FROM   Employee
    WHERE  Employee.Title = "Sales Support Agent"
  `, (err, emp) => tbl4.push([emp.Name])
  , () => console.log(tbl4.toString()))

})

db.close()