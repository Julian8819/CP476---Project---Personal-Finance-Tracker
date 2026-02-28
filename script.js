let transactions = [];
let transactionId = 1;
let currentPageDelete = 1;
let currentPageEdit = 1;
const itemsPerPage = 5;

let summaryChart;
const incomeCategories = ['Salary','Misc'];
const expenseCategories = ['Food','Rent','Transportation','Misc'];

// Initialize Chart
function initChart(){

  const ctx = document.getElementById('summaryChart')?.getContext('2d');

  if(ctx){

    summaryChart = new Chart(ctx,{

      type:'doughnut',

      data:{labels:['Income','Expenses'], datasets:[{data:[0,0], backgroundColor:['#4caf50','#f44336']}]},

      options:{responsive:true, plugins:{legend:{display:false}}}

    });
  }
  updateCategoryOptions('addType','addCategory');

  updateCategoryOptions('editType','editCategory');
}

// Show/Close Windows (only one open at a time)
function showWindow(id){

  document.querySelectorAll('.window').forEach(win=>win.classList.add('hidden'));

  document.getElementById(id).classList.remove('hidden');

  renderDeleteList();

  renderEditList();

  renderSummaryTable();
}

function closeWindow(id){ document.getElementById(id).classList.add('hidden'); }

// Update Categories
document.getElementById('addType')?.addEventListener('change', ()=>updateCategoryOptions('addType','addCategory'));

document.getElementById('editType')?.addEventListener('change', ()=>updateCategoryOptions('editType','editCategory'));

function updateCategoryOptions(typeId, categoryId){

  const type = document.getElementById(typeId)?.value;

  const categorySelect = document.getElementById(categoryId);

  if(!categorySelect) return;

  categorySelect.innerHTML='';

  const categories = type==='income'?incomeCategories:expenseCategories;

  categories.forEach(c=>{

    const option = document.createElement('option');

    option.value=c; option.text=c;

    categorySelect.appendChild(option);
  });
}

// Add Transaction
document.getElementById('addForm')?.addEventListener('submit', e=>{

  e.preventDefault();

  const amount = Number(document.getElementById('addAmount').value);

  const type = document.getElementById('addType').value;

  const category = document.getElementById('addCategory').value;

  const date = new Date().toISOString().split('T')[0];

  transactions.push({id:transactionId++, amount, type, category, date});

  document.getElementById('addForm').reset();

  closeWindow('addWindow');

  updateChart();
});

// Delete Transactions
function renderDeleteList(){

  const listDiv=document.getElementById('deleteList');

  if(!listDiv) return;

  listDiv.innerHTML='';

  const start=(currentPageDelete-1)*itemsPerPage;

  const pageItems=transactions.slice(start,start+itemsPerPage);

  pageItems.forEach(t=>{

    const div=document.createElement('div');

    div.innerHTML=`<span>${t.date} - ${t.type} - ${t.category} - ${t.amount}</span><button onclick="confirmDelete(${t.id})">Delete</button>`;

    listDiv.appendChild(div);

  });
  document.getElementById('pageNumberDelete').innerText=`Page ${currentPageDelete}`;
}

function prevPage(type){

  if(type==='delete' && currentPageDelete>1){ currentPageDelete--; renderDeleteList(); }

  if(type==='edit' && currentPageEdit>1){ currentPageEdit--; renderEditList(); }
}
function nextPage(type){

  if(type==='delete' && currentPageDelete*itemsPerPage<transactions.length){ currentPageDelete++; renderDeleteList(); }

  if(type==='edit' && currentPageEdit*itemsPerPage<transactions.length){ currentPageEdit++; renderEditList(); }
}
function confirmDelete(id){

  if(confirm('Delete this transaction?')){

    transactions=transactions.filter(t=>t.id!==id);

    renderDeleteList();

    closeWindow('deleteWindow');

    updateChart();
  }
}

// Edit Transactions
function renderEditList(){

  const listDiv=document.getElementById('editList');

  if(!listDiv) return;

  listDiv.innerHTML='';

  const start=(currentPageEdit-1)*itemsPerPage;

  const pageItems=transactions.slice(start,start+itemsPerPage);

  pageItems.forEach(t=>{

    const div=document.createElement('div');

    div.innerHTML=`<span>${t.date} - ${t.type} - ${t.category} - ${t.amount}</span><button onclick="loadEditForm(${t.id})">Edit</button>`;

    listDiv.appendChild(div);
  });
  document.getElementById('pageNumberEdit').innerText=`Page ${currentPageEdit}`;
}

function loadEditForm(id){

  const t=transactions.find(x=>x.id===id);

  if(!t) return;

  document.getElementById('editAmount').value=t.amount;

  document.getElementById('editType').value=t.type;

  updateCategoryOptions('editType','editCategory');

  document.getElementById('editCategory').value=t.category;

  showWindow('editFormWindow');

  document.getElementById('editForm').onsubmit=function(e){

    e.preventDefault();

    t.amount=Number(document.getElementById('editAmount').value);

    t.type=document.getElementById('editType').value;

    t.category=document.getElementById('editCategory').value;

    closeWindow('editFormWindow');

    closeWindow('editWindow');

    updateChart();
  }
}

// Summary Table
function renderSummaryTable(){

  const tbody=document.querySelector('#summaryTable tbody');

  if(!tbody) return;

  tbody.innerHTML='';

  let income=0, expenses=0;

  const filterDate=document.getElementById('filterDate').value;

  transactions.forEach(t=>{

    if(filterDate && t.date!==filterDate) return;

    const tr=document.createElement('tr');

    tr.className=t.type;

    tr.innerHTML=`<td>${t.category}</td><td>${t.date}</td><td>${t.type}</td><td>${t.amount}</td>`;

    tbody.appendChild(tr);

    if(t.type==='income') income+=t.amount; else expenses+=t.amount;

  });
  const balance = income - expenses;

  const netBalance=document.getElementById('netBalance');

  if(netBalance){

    netBalance.innerText=`Net Balance: ${balance}`;

    netBalance.style.color = balance>=0?'green':'red';

    netBalance.style.fontSize='28px';
  }
}

// Update Chart
function updateChart(){

  if(!summaryChart) return;

  const income = transactions.filter(t=>t.type==='income').reduce((sum,t)=>sum+t.amount,0);

  const expenses = transactions.filter(t=>t.type==='expense').reduce((sum,t)=>sum+t.amount,0);

  summaryChart.data.datasets[0].data=[income,expenses];

  summaryChart.update();
}

document.getElementById('filterDate')?.addEventListener('change', renderSummaryTable);

window.onload = function(){

  initChart();
  renderDeleteList();
  renderEditList();
  renderSummaryTable();
}