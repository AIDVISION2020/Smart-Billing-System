export const handlePrint = (printContent) => {
  const printWindow = window.open("", "_blank");
  printWindow.document.write(`
      <html>
        <head>
          <title>Print Chart</title>
          <style>
            body { font-family: sans-serif; padding: 20px; }
            h2 { margin-bottom: 20px; }
          </style>
        </head>
        <body>
          ${printContent}
        </body>
      </html>
    `);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
  printWindow.close();
};

export const getTrendsData = (allBills, trendView) => {
  const trends = {};
  (allBills || []).forEach((bill) => {
    const date = new Date(bill.createdAt);

    let key;
    if (trendView === "daily") {
      key = date.toISOString().split("T")[0];
    } else if (trendView === "weekly") {
      key = `${date.getFullYear()}-W${Math.ceil(
        (date.getDate() - date.getDay() + 1) / 7
      )}`;
    } else {
      key = `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}`;
    }

    if (!trends[key]) {
      trends[key] = { period: key, revenue: 0, bills: 0 };
    }
    trends[key].revenue += parseFloat(bill.totalAmount);
    trends[key].bills += 1;
  });

  return Object.values(trends).sort((a, b) => a.period.localeCompare(b.period));
};

export const exportTopSellingItemsToCSV = (allItems, chartMetric) => {
  const headers = [
    "Item ID",
    "Item Name",
    "Quantity Sold",
    "Price When Bought",
    "Tax When Bought",
    "Revenue(INR)",
  ];

  const rows = Object.values(allItems).map((item) => {
    return [
      item.key,
      item.name,
      item.quantity,
      item.priceWhenBought.toFixed(2),
      item.taxWhenBought.toFixed(2),
      item.revenue.toFixed(2),
    ];
  });

  let csvContent =
    "data:text/csv;charset=utf-8," +
    [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `items_${chartMetric}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportTrendsToCSV = (allBills, trendView) => {
  const trendsData = getTrendsData(allBills, trendView);
  const headers = ["Time Period", "Revenue(INR)", "Bills"];

  const rows = trendsData.map((trend) => [
    trend.period,
    `${trend.revenue.toFixed(2)}`,
    trend.bills,
  ]);
  let csvContent =
    "data:text/csv;charset=utf-8," +
    [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "trends_data.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
