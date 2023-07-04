import express from "express";
import { uploadData, getTotalItems, nth_most_total_item, monthlySales, percent_wise_sold_items }from "../controllers/trans.control.js";
import uploads from "../utils/multer_config.js";
const router = express.Router();

router.get("/", (req, res) => {
    res.send('Hello World!');
});
router.post("/upload", uploads.single('file'), uploadData);
router.get("/total_items", getTotalItems);
router.get("/nth_most_total_item", nth_most_total_item);
router.get("/monthly_sales", monthlySales);
router.get("/percentage_of_department_wise_sold_items", percent_wise_sold_items);

export default router;