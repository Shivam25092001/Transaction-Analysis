import asyncCatch from '../middlewares/catchAsync.js';
import Transaction from '../models/transaction.model.js';
import csv from 'csvtojson';



const uploadData = asyncCatch((req, res) => {
    //convert csv to jsonArray
    csv().fromFile(req.file.path)
    .then((jsonObj) => {
        // console.log(jsonObj);
        for(var x=0;x<jsonObj.length;x++){ 
            let temp1 = parseFloat(jsonObj[x].id)  
            jsonObj[x].id = temp1;  
            jsonObj[x].date = new Date(jsonObj[x].date);   
            let temp3 = parseFloat(jsonObj[x].seats)  
            jsonObj[x].seats = temp3;  
            let temp4 = parseFloat(jsonObj[x].amount)  
            jsonObj[x].amount = temp4; 
        }

        //insertmany is used to save bulk data in database.
        //saving the data in collection(table)
        Transaction.insertMany(jsonObj)
        .then((data) => {
            console.log('Data inserted successfully');
            res.send(data);
        }).catch((error) => {
            res.send(error);
        });
    });  
});  


const getTotalItems = asyncCatch(async (req, res) => {
    const start = new Date(`${req.query.start_date}`);
    const end = new Date(`${req.query.end_date}`);
    const department = req.query.department;

    const options = {
        "date": {"$gte": start, "$lt": end},
        "department": department
    }
    const totalItems = await Transaction.find(options);
    res.json({
        length: totalItems.length,
        // totalItems: totalItems
    });
});

const nth_most_total_item = asyncCatch(async (req, res) => {
    let item_by = req.query.item_by || "amount";
    switch(req.query.item_by){
        case "quantity" : 
            item_by = "seats";
            break;
        case "price" :
            item_by = "amount";
            break;
    }
    const start = new Date(`${req.query.start_date}`);
    const end = new Date(`${req.query.end_date}`);
    const options = {
        "date": {"$gte": start, "$lt": end},
    }

    console.log(options);

    const transactions = await Transaction.find(options).sort(item_by);
    res.json({
        name: transactions[transactions.length - 1].user
    });
});


const monthlySales = asyncCatch(async (req, res) => {
    const start = new Date(`${req.query.year}-01-01`);
    const end = new Date(`${req.query.year}-12-31`);
    const product = req.query.product;

    const options = {
        "date": {"$gte": start, "$lte": end},
        "software": product
    }

    const items =  await Transaction.find(options);
    let monthlySales = [0,0,0,0,0,0,0,0,0,0,0,0];

    for(let i=0; i<items.length; i++){
        let month = items[i].date.getMonth();
        monthlySales[month] += items[i].seats;
    }
    
    res.json({
        monthlySales
    });
});

const percent_wise_sold_items = asyncCatch(async (req, res) => {
    const start_date = new Date(`${req.query.start_date}`);
    const end_date = new Date(`${req.query.end_date}`);

    const options = {
        "date": {"$gte": start_date, "$lte": end_date},
    };

    const itemsSold = await Transaction.find(options);
    let seatsSold = 0;
    for(let i=0; i<itemsSold.length; i++){
        seatsSold += itemsSold[i].seats;
    }
    const items = await Transaction
    .aggregate([
        {
            $match: options,
        },
        {
            $group: {
                _id: {department : "$department"},
                total: { $sum: "$seats" },
            }
        }
    ]);

    let result = {};
    for(let i=0; i<items.length; i++){
        let percent = (items[i].total/seatsSold)*100;
        result[items[i]._id.department] = percent;
        console.log(items[i]._id.department);
    }

    res.json({
        result
    });
});


export { uploadData, getTotalItems , nth_most_total_item, monthlySales, percent_wise_sold_items };