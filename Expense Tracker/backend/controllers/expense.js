const ExpenseSchema = require("../models/expenseModel");

exports.addExpense = async (req, res) => {
  const { title, amount, category, description, date } = req.body;

  const expense = ExpenseSchema({
    title,
    amount,
    category,
    description,
    date,
  });

  try {
    //validation
    if (!title || !category || !description || !date) {
      return res.status(400).json({ message: "All field need to be required" });
    }
    if (amount <= 0 || !amount === "number") {
      return res
        .status(400)
        .json({ message: "Amount must be a positive number" });
    }

    await expense.save();
    res.status(200).json({ messsage: "Expense added" });
  } catch (error) {
    return res.status(500).json(error);
  }
};

exports.getExpenses=async(req,res)=>{
    try {
        const expenses= await ExpenseSchema.find().sort({createdAt:-1})
        res.status(200).json(expenses)
    } catch (error) {
        res.status(500).json({message:'Server Error'})
    }
}

exports.deleteExpense=async(req,res)=>{
    const {id}=req.params;
    ExpenseSchema.findByIdAndDelete(id)
    .then((expense)=>{
        res.status(200).json({message: 'Expense Deleted'})
    })
    .catch((error)=>{
        res.status(500).json({message: 'Server Error'})
 
    })
} 