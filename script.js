let interval;
let logEntries = [];

function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('zh-cn', { hour12: false }) + '.' + now.getMilliseconds().toString().padStart(3, '0');
    document.getElementById('time').textContent = timeString;
}

function startClock() {
    interval = setInterval(updateTime, 1);
}

function recordTime() {
    const log = document.getElementById('log');
    const now = new Date();
    const timeString = now.toLocaleTimeString('zh-cn', { hour12: false }) + '.' + now.getMilliseconds().toString().padStart(3, '0');
    logEntries.push(timeString);
    if (logEntries.length > 5) {
        logEntries.shift();
    }
    log.innerHTML = logEntries.map(entry => `<div>${entry}</div>`).join('');

    // 插入到表格中
    const tableBody = document.querySelector('#timeTable tbody');
    const newRow = document.createElement('tr');
    const newCell = document.createElement('td');
    newCell.textContent = timeString;
    newRow.appendChild(newCell);
    tableBody.appendChild(newRow);

    // 保持表格只显示最近5条记录
    if (tableBody.rows.length > 5) {
        tableBody.deleteRow(0);
    }
}

function stopClock() {
    clearInterval(interval);
}

document.getElementById('recordButton').addEventListener('click', recordTime);
document.getElementById('stopButton').addEventListener('click', stopClock);

startClock();

// 读取Excel文件并插入到表格中
document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets['Sheet1'];
        const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        const tableHead = document.querySelector('#excelTable thead');
        const tableBody = document.querySelector('#excelTable tbody');
        tableHead.innerHTML = ''; // 清空表头内容
        tableBody.innerHTML = ''; // 清空表格内容

        // 插入表头
        const headerRow = document.createElement('tr');
        json[0].forEach(header => {
            const headerCell = document.createElement('th');
            headerCell.textContent = header;
            headerRow.appendChild(headerCell);
        });
        tableHead.appendChild(headerRow);

        // 插入表格内容
        json.slice(1).forEach(row => {
            const newRow = document.createElement('tr');
            row.forEach(cell => {
                const newCell = document.createElement('td');
                newCell.textContent = cell;
                newRow.appendChild(newCell);
            });
            tableBody.appendChild(newRow);
        });
    };
    reader.readAsArrayBuffer(file);
});