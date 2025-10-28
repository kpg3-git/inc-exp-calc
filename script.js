
const form = document.getElementById("userEntries");
const selectOptn = document.getElementById("selectOptn");
const description = document.getElementById("description");
const amount = document.getElementById("amount");
const resetBtn = document.getElementById("resetBtn");
const entryList = document.getElementById("userEntryLists");

const totalInc = document.getElementById("totalInc");
const totalExp = document.getElementById("totalExp");
const netBal = document.getElementById("netBal");

const radioButtons = document.querySelectorAll("input[name='radioBtn']");

let entries = JSON.parse(localStorage.getItem("entries")) || []; 
let editId = null; 

function saveToLocalStorage() 
{
  localStorage.setItem("entries", JSON.stringify(entries));  // saving entries to localStorage
}

function updateTotals() 
{
  const incomeEntries = entries.filter(function (e) 
  {
    return e.type === "inc";
  });

  const expenseEntries = entries.filter(function (e) 
  {
    return e.type === "exp";
  });

  let totalIncome = 0;
  let totalExpense = 0;

  for (let i = 0; i < incomeEntries.length; i++) 
  {
    totalIncome += incomeEntries[i].amount;
  }

  for (let i = 0; i < expenseEntries.length; i++)
  {
    totalExpense += expenseEntries[i].amount;
  }

  const balance = totalIncome - totalExpense;

  totalInc.textContent = "Rs." + totalIncome;
  totalExp.textContent = "Rs." + totalExpense;
  netBal.textContent = "Rs." + balance;
}

// filter
function renderEntries(filter = "all") 
{
  entryList.innerHTML = "";

  let filteredEntries;

  if (filter === "all") 
  {
    filteredEntries = entries;
  } 
  else if (filter === "income") 
  {
    filteredEntries = entries.filter(function (e) 
    {
      return e.type === "inc";
    });
  } 
  else 
  {
    filteredEntries = entries.filter(function (e) 
    {
      return e.type === "exp";
    });
  }

  if (filteredEntries.length === 0) 
  {
    entryList.innerHTML = "<li style='background-color:#97bcd7;color:white;'>Save entries to display.</li>";
    updateTotals();
    return;
  }

  for (let i = 0; i < filteredEntries.length; i++) 
  {
    const entry = filteredEntries[i];
    const li = document.createElement("li");

    if (entry.type === "inc") 
    {
      li.classList.add("income");
    } 
    else 
    {
      li.classList.add("expense");
    }

    li.innerHTML =
      "<span>" +
      entry.description +
      " - Rs." +
      entry.amount +
      "</span>" +
      "<div>" +
      "<button onclick=\"editEntry('" + entry.id + "')\">📝 Edit</button>" +
      "<button onclick=\"deleteEntry('" + entry.id + "')\">⚠️ Delete</button>" +
      "</div>";

    entryList.appendChild(li);
  }

  updateTotals();
}

// CRUD Operations

form.addEventListener("submit", function (e) 
{
  e.preventDefault();

  const type = selectOptn.value;
  const desc = description.value.trim();
  const amt = Number(amount.value);

  if (!type || desc === "" || isNaN(amt) || amt <= 0) 
  {
    alert("Please fill all fields correctly!");
    return;
  }

  if (editId !== null) 
  {
    for (let i = 0; i < entries.length; i++)    
    {  
      if (entries[i].id === editId) 
      {
        entries[i].type = type;
        entries[i].description = desc;
        entries[i].amount = amt;
        break;
      }
    }
    editId = null;
  } 
  else 
  {          
    const newEntry =            // create
    {
      id: Date.now().toString(),
      type: type,
      description: desc,
      amount: amt
    };
    entries.push(newEntry);
  }

  saveToLocalStorage();
  renderEntries(getSelectedFilter());
  form.reset();
});

function getSelectedFilter()  // read
{
  const selected = document.querySelector("input[name='radioBtn']:checked");
  if (selected) 
  {
    return selected.value;
  } 
  else 
  {
    return "all";
  }
}

window.editEntry = function (id)     // update
{
  let entry = null;

  for (let i = 0; i < entries.length; i++) 
  {
    if (entries[i].id === id) 
    {
      entry = entries[i];
      break;
    }
  }

  if (entry !== null) 
  {
    selectOptn.value = entry.type;
    description.value = entry.description;
    amount.value = entry.amount;
    editId = id;
  }
};

window.deleteEntry = function (id)         // delete
{
  const confirmDelete = confirm("Are you sure you want to delete this entry?");
  if (confirmDelete) 
  {
    const newEntries = [];

    for (let i = 0; i < entries.length; i++) 
    {
      if (entries[i].id !== id) 
      {
        newEntries.push(entries[i]);
      }
    }

    entries = newEntries;
    saveToLocalStorage();
    renderEntries(getSelectedFilter());
  }
};

// reset btn

resetBtn.addEventListener("click", function () 
{
  form.reset();
  editId = null;
});

// radio btn

for (let i = 0; i < radioButtons.length; i++) 
{
  radioButtons[i].addEventListener("change", function () 
  {
    renderEntries(getSelectedFilter());
  });
}

renderEntries();
updateTotals();
