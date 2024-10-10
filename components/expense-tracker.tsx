"use client";
import React, { useState, useEffect, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FilePenIcon, PlusIcon, TrashIcon } from "lucide-react";
import { format } from "date-fns";

type Expense={
    id:number;
    name:string;
    amount:number;
    date:Date
}

const intitialExpenses:Expense[]=[{
    id:1,
    name:"Groceries",
    amount:250,
    date:new Date("2024-05-15")
},{
    id:2,
    name:"Rent",
    amount:250,
    date:new Date("2024-06-01")
},
{
  id: 3,
  name: "Utilities",
  amount: 250,
  date: new Date("2024-06-05"),
},
{
  id: 4,
  name: "Dining Out",
  amount: 250,
  date: new Date("2024-06-10"),
}]

export default function ExpenseTrackerComponent() {
const [expenses,setExpenses]=useState<Expense[]>([])
const [showModal,setShowModal]=useState<boolean>(false)
const [currentExpenseID,setcurrentExpenseID]=useState<number|null>(null)
const [isEditing,setIsEditing]=useState<boolean>(false)
const[newExpense,setNewExpense]=useState<{name:string,amount:string,date:Date}>({
    name:"",
    amount:"",
    date:new Date()
})

useEffect(()=>{
    const storedExpenses=localStorage.getItem("expenses");
if(storedExpenses){
    setExpenses(JSON.parse(storedExpenses).map((expense:Expense)=>({
        ...expense,
        date:new Date(expense.date)
    })))
}else{
    setExpenses(intitialExpenses)
}
},[])


useEffect(()=>{
if(expenses.length>0){
    localStorage.setItem("expenses",JSON.stringify(expenses))
}
},[expenses])


const handleAddExpense=()=>{
setExpenses([
    ...expenses,{
        id:expenses.length+1,
        name:newExpense.name,
        amount:parseFloat(newExpense.amount),
date:new Date(newExpense.date)
    }
])
}
const handleEditExpense=(id:number):void=>{
     const expenseToEdit=expenses.find((expense)=>expense.id===id)
     if(expenseToEdit){
        setNewExpense({
            name:expenseToEdit.name,
            amount:expenseToEdit.amount.toString(),
            date:expenseToEdit.date
        })
        setcurrentExpenseID(id);
        setIsEditing(true);
        setShowModal(true)
     }
}


const handleSaveEditExpense=()=>{
    setExpenses(
        expenses.map((expense)=>expense.id===currentExpenseID?{...expense,...newExpense,amount:parseFloat(newExpense.amount)}:expense)
    )
    resetForm()
    setShowModal(false)
}

const resetForm=():void=>{
setNewExpense({
    name:"",
    amount:"",
    date:new Date()
})
setIsEditing(false);
setcurrentExpenseID(null)
}
const handleDeleteExpense=(id:number)=>{
setExpenses(expenses.filter((expense)=>expense.id!==id))
}
const handleInputchange=(e:ChangeEvent<HTMLInputElement>)=>{
const{id,value}=e.target

setNewExpense((prevExpense)=>({
    ...prevExpense,
    [id]:
    id==="amount"
    ?parseFloat(value)
    :id==="date"
    ?new Date(value)
    :value
}))
};
const totalExpense=expenses.reduce((total,expense)=>total+expense.amount,0)


    return(
        <>
<div className="flex flex-col h-screen">
<header className="bg-primary text-primary-foreground py-4 px-3">
    <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Expense Tracker</h1>
<h1 className="text-2xl font-bold">Total: ${totalExpense.toFixed(2)}</h1>
    </div>
</header>
<main className="flex-1 overflow-y-auto">
<ul className="space-y-4">
{expenses.map((expense)=>(
    <li key={expense.id} className="bg-card flex p-4 justify-between items-center   shadow-lg rounded-xl">
<div>
    <h1 className="font-bold text-xl">{expense.name}</h1>
    <p className="text-muted-foreground">${expense.amount} - {format(expense.date,"dd/MM/yyyy")}</p>
</div>
<div className="flex space-x-2">
    <Button variant="ghost" size="icon" onClick={()=>handleEditExpense(expense.id)}>
<FilePenIcon/>
    </Button>
    <Button variant="ghost" size="icon" onClick={()=>handleDeleteExpense(expense.id)}>
        <TrashIcon/>
    </Button>
</div>
    </li>
))}
</ul>
</main>
<div className="fixed right-6 bottom-6">
<Button size="icon" className="rounded-full" onClick={()=>{setShowModal(true);setIsEditing(false);resetForm()}}>
    <PlusIcon className="w-6 h-6"/>
</Button>
</div>
<Dialog open={showModal} onOpenChange={setShowModal}>
<DialogContent className="bg-card p-6 rounded-lg shadow w-full max-w-md">
<DialogHeader>
    <DialogTitle>{isEditing?"Edit Expense":"Add Expense"}</DialogTitle>
</DialogHeader>
<div>
<div className="grid gap-4">
<div className="grid gap-2">
<Label>Expense Name</Label>
<Input id="name" value={newExpense.name} onChange={handleInputchange}/>
</div>
<div className="grid gap-2">
<Label>Amount</Label>
<Input id="amount" type="number" value={newExpense.amount} onChange={handleInputchange}/>
</div>
<div className="grid gap-2">
<Label>Date</Label>
<Input id="date" type="date" value={newExpense.date.toISOString().slice(0, 10)} onChange={handleInputchange}/>
</div>
</div>
</div>

<DialogFooter>
    <Button variant="outline" onClick={()=>setShowModal(false)}>Cancel</Button>
    <Button onClick={isEditing?handleSaveEditExpense : handleAddExpense}>{isEditing ? "Save Changes" : "Add Expense"}</Button>
</DialogFooter>
</DialogContent>
</Dialog>
</div>

        </>
    )
}