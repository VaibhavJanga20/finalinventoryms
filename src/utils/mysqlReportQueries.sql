
-- MySQL Report Generation Commands
-- This file contains MySQL queries, stored procedures, triggers, and views that would 
-- be used to generate the data displayed in the application's reports.
-- Note: This is for documentation purposes only and is not connected to the application.

-- ====================================================================================
-- FINANCIAL REPORTS - QUERIES AND PROCEDURES
-- ====================================================================================

-- Income Statement Data Query
-- Used for Financial Overview & Income Statement Reports
DELIMITER //
CREATE PROCEDURE GetIncomeStatementData(IN start_date DATE, IN end_date DATE)
BEGIN
    SELECT 
        DATE_FORMAT(transaction_date, '%b') AS month,
        SUM(CASE WHEN transaction_type = 'revenue' THEN amount ELSE 0 END) AS revenue,
        SUM(CASE WHEN transaction_type = 'expense' THEN amount ELSE 0 END) AS expenses,
        SUM(CASE WHEN transaction_type = 'revenue' THEN amount ELSE -amount END) AS profit
    FROM financial_transactions
    WHERE transaction_date BETWEEN start_date AND end_date
    GROUP BY DATE_FORMAT(transaction_date, '%b'), MONTH(transaction_date)
    ORDER BY MONTH(transaction_date);
END //
DELIMITER ;

-- Sales by Category Query
-- Used for Financial Overview Report Pie Chart
DELIMITER //
CREATE PROCEDURE GetSalesByCategory(IN start_date DATE, IN end_date DATE)
BEGIN
    SELECT 
        p.category AS name,
        ROUND((SUM(od.price * od.quantity) / (
            SELECT SUM(price * quantity) 
            FROM order_details 
            JOIN orders o ON order_details.order_id = o.id
            WHERE o.order_date BETWEEN start_date AND end_date
        )) * 100) AS value
    FROM order_details od
    JOIN products p ON od.product_id = p.id
    JOIN orders o ON od.order_id = o.id
    WHERE o.order_date BETWEEN start_date AND end_date
    GROUP BY p.category
    ORDER BY value DESC;
END //
DELIMITER ;

-- Expense Breakdown Query
-- Used for Financial Overview Report Pie Chart
DELIMITER //
CREATE PROCEDURE GetExpenseBreakdown(IN start_date DATE, IN end_date DATE)
BEGIN
    SELECT 
        expense_category AS name,
        ROUND((SUM(amount) / (
            SELECT SUM(amount) 
            FROM expenses 
            WHERE expense_date BETWEEN start_date AND end_date
        )) * 100) AS value
    FROM expenses
    WHERE expense_date BETWEEN start_date AND end_date
    GROUP BY expense_category
    ORDER BY value DESC;
END //
DELIMITER ;

-- Cash Flow Data Query
-- Used for Cash Flow Report
DELIMITER //
CREATE PROCEDURE GetCashFlowData(IN start_date DATE, IN end_date DATE)
BEGIN
    SELECT 
        DATE_FORMAT(transaction_date, '%b') AS month,
        SUM(CASE WHEN flow_category = 'operating' THEN amount ELSE 0 END) AS operating,
        SUM(CASE WHEN flow_category = 'investing' THEN amount ELSE 0 END) AS investing,
        SUM(CASE WHEN flow_category = 'financing' THEN amount ELSE 0 END) AS financing
    FROM cash_flow_transactions
    WHERE transaction_date BETWEEN start_date AND end_date
    GROUP BY DATE_FORMAT(transaction_date, '%b'), MONTH(transaction_date)
    ORDER BY MONTH(transaction_date);
END //
DELIMITER ;

-- Balance Sheet Asset Data Query
-- Used for Balance Sheet Report
DELIMITER //
CREATE PROCEDURE GetBalanceSheetAssets(IN as_of_date DATE)
BEGIN
    -- Current Assets
    SELECT 
        'Current Assets' AS category,
        asset_name AS name,
        current_value AS value
    FROM assets
    WHERE asset_type = 'current' AND valuation_date <= as_of_date
    AND asset_id IN (
        SELECT asset_id FROM (
            SELECT asset_id, MAX(valuation_date) as latest_date
            FROM assets
            WHERE valuation_date <= as_of_date AND asset_type = 'current'
            GROUP BY asset_id
        ) latest_valuations
        WHERE latest_valuations.latest_date = assets.valuation_date
    )
    
    UNION ALL
    
    -- Fixed Assets
    SELECT 
        'Fixed Assets' AS category,
        asset_name AS name,
        current_value AS value
    FROM assets
    WHERE asset_type = 'fixed' AND valuation_date <= as_of_date
    AND asset_id IN (
        SELECT asset_id FROM (
            SELECT asset_id, MAX(valuation_date) as latest_date
            FROM assets
            WHERE valuation_date <= as_of_date AND asset_type = 'fixed'
            GROUP BY asset_id
        ) latest_valuations
        WHERE latest_valuations.latest_date = assets.valuation_date
    );
END //
DELIMITER ;

-- Balance Sheet Liabilities Query
-- Used for Balance Sheet Report
DELIMITER //
CREATE PROCEDURE GetBalanceSheetLiabilities(IN as_of_date DATE)
BEGIN
    -- Current Liabilities
    SELECT 
        'Current Liabilities' AS category,
        liability_name AS name,
        current_amount AS value
    FROM liabilities
    WHERE liability_type = 'current' AND valuation_date <= as_of_date
    AND liability_id IN (
        SELECT liability_id FROM (
            SELECT liability_id, MAX(valuation_date) as latest_date
            FROM liabilities
            WHERE valuation_date <= as_of_date AND liability_type = 'current'
            GROUP BY liability_id
        ) latest_valuations
        WHERE latest_valuations.latest_date = liabilities.valuation_date
    )
    
    UNION ALL
    
    -- Long-term Liabilities
    SELECT 
        'Long-term Liabilities' AS category,
        liability_name AS name,
        current_amount AS value
    FROM liabilities
    WHERE liability_type = 'long-term' AND valuation_date <= as_of_date
    AND liability_id IN (
        SELECT liability_id FROM (
            SELECT liability_id, MAX(valuation_date) as latest_date
            FROM liabilities
            WHERE valuation_date <= as_of_date AND liability_type = 'long-term'
            GROUP BY liability_id
        ) latest_valuations
        WHERE latest_valuations.latest_date = liabilities.valuation_date
    );
END //
DELIMITER ;

-- Balance Sheet Equity Query
-- Used for Balance Sheet Report
DELIMITER //
CREATE PROCEDURE GetBalanceSheetEquity(IN as_of_date DATE)
BEGIN
    SELECT 
        equity_name AS name,
        current_amount AS value
    FROM equity
    WHERE valuation_date <= as_of_date
    AND equity_id IN (
        SELECT equity_id FROM (
            SELECT equity_id, MAX(valuation_date) as latest_date
            FROM equity
            WHERE valuation_date <= as_of_date
            GROUP BY equity_id
        ) latest_valuations
        WHERE latest_valuations.latest_date = equity.valuation_date
    );
END //
DELIMITER ;

-- Sales Analysis Data Query
-- Used for Sales Analysis Report
DELIMITER //
CREATE PROCEDURE GetSalesAnalysisByMonth(IN start_date DATE, IN end_date DATE)
BEGIN
    SELECT 
        DATE_FORMAT(o.order_date, '%b') AS month,
        SUM(CASE WHEN p.category = 'Electronics' THEN od.price * od.quantity ELSE 0 END) AS electronics,
        SUM(CASE WHEN p.category = 'Furniture' THEN od.price * od.quantity ELSE 0 END) AS furniture,
        SUM(CASE WHEN p.category = 'Clothing' THEN od.price * od.quantity ELSE 0 END) AS clothing,
        SUM(CASE WHEN p.category = 'Books' THEN od.price * od.quantity ELSE 0 END) AS books,
        SUM(CASE WHEN p.category NOT IN ('Electronics', 'Furniture', 'Clothing', 'Books') THEN od.price * od.quantity ELSE 0 END) AS other
    FROM orders o
    JOIN order_details od ON o.id = od.order_id
    JOIN products p ON od.product_id = p.id
    WHERE o.order_date BETWEEN start_date AND end_date
    GROUP BY DATE_FORMAT(o.order_date, '%b'), MONTH(o.order_date)
    ORDER BY MONTH(o.order_date);
END //
DELIMITER ;

-- Top Products By Revenue
-- Used for Sales Analysis Report
DELIMITER //
CREATE PROCEDURE GetTopProductsByRevenue(IN start_date DATE, IN end_date DATE, IN limit_count INT)
BEGIN
    SELECT 
        p.name,
        p.category,
        SUM(od.price * od.quantity) AS revenue,
        SUM(od.quantity) AS units
    FROM order_details od
    JOIN products p ON od.product_id = p.id
    JOIN orders o ON od.order_id = o.id
    WHERE o.order_date BETWEEN start_date AND end_date
    GROUP BY p.id, p.name, p.category
    ORDER BY revenue DESC
    LIMIT limit_count;
END //
DELIMITER ;

-- Sales by Region
-- Used for Sales Analysis Report
DELIMITER //
CREATE PROCEDURE GetSalesByRegion(IN start_date DATE, IN end_date DATE)
BEGIN
    SELECT 
        c.region AS name,
        ROUND((SUM(o.total_amount) / (
            SELECT SUM(total_amount) 
            FROM orders 
            WHERE order_date BETWEEN start_date AND end_date
        )) * 100) AS value
    FROM orders o
    JOIN customers c ON o.customer_id = c.id
    WHERE o.order_date BETWEEN start_date AND end_date
    GROUP BY c.region
    ORDER BY value DESC;
END //
DELIMITER ;

-- ====================================================================================
-- INVENTORY REPORTS - QUERIES AND PROCEDURES
-- ====================================================================================

-- Inventory Status Distribution
-- Used for Inventory Overview Report
DELIMITER //
CREATE PROCEDURE GetInventoryStatusDistribution()
BEGIN
    SELECT 
        inventory_status AS status,
        COUNT(*) AS count,
        ROUND((COUNT(*) / (SELECT COUNT(*) FROM inventory)) * 100, 2) AS percentage
    FROM inventory
    GROUP BY inventory_status
    ORDER BY FIELD(inventory_status, 'In Stock', 'Low Stock', 'Out of Stock');
END //
DELIMITER ;

-- Inventory by Category
-- Used for Inventory Reports
DELIMITER //
CREATE PROCEDURE GetInventoryByCategory()
BEGIN
    SELECT 
        p.category,
        SUM(i.quantity) AS total_quantity,
        COUNT(i.id) AS item_count,
        AVG(i.quantity) AS avg_quantity,
        MIN(i.quantity) AS min_quantity,
        MAX(i.quantity) AS max_quantity
    FROM inventory i
    JOIN products p ON i.product_id = p.id
    GROUP BY p.category
    ORDER BY total_quantity DESC;
END //
DELIMITER ;

-- Low Stock Items
-- Used for Inventory Reports
DELIMITER //
CREATE PROCEDURE GetLowStockItems(IN threshold INT)
BEGIN
    SELECT 
        p.id,
        p.name,
        p.category,
        i.quantity,
        i.reorder_level,
        p.price,
        (p.price * i.quantity) AS inventory_value,
        i.last_updated
    FROM inventory i
    JOIN products p ON i.product_id = p.id
    WHERE i.quantity <= i.reorder_level
    ORDER BY (i.quantity / i.reorder_level) ASC;
END //
DELIMITER ;

-- Inventory Age Analysis
-- Used for Inventory Reports
DELIMITER //
CREATE PROCEDURE GetInventoryAgeAnalysis()
BEGIN
    SELECT 
        p.category,
        CASE 
            WHEN DATEDIFF(CURRENT_DATE, i.received_date) <= 30 THEN '0-30 days'
            WHEN DATEDIFF(CURRENT_DATE, i.received_date) <= 60 THEN '31-60 days'
            WHEN DATEDIFF(CURRENT_DATE, i.received_date) <= 90 THEN '61-90 days'
            ELSE 'Over 90 days'
        END AS age_group,
        COUNT(*) AS item_count,
        SUM(i.quantity) AS total_quantity,
        SUM(p.price * i.quantity) AS inventory_value
    FROM inventory i
    JOIN products p ON i.product_id = p.id
    GROUP BY p.category, age_group
    ORDER BY p.category, FIELD(age_group, '0-30 days', '31-60 days', '61-90 days', 'Over 90 days');
END //
DELIMITER ;

-- Inventory Movement Trends
-- Used for Inventory Reports
DELIMITER //
CREATE PROCEDURE GetInventoryMovementTrends(IN months_back INT)
BEGIN
    SELECT 
        DATE_FORMAT(im.transaction_date, '%Y-%m') AS month,
        p.category,
        SUM(CASE WHEN im.transaction_type = 'in' THEN im.quantity ELSE 0 END) AS received,
        SUM(CASE WHEN im.transaction_type = 'out' THEN im.quantity ELSE 0 END) AS shipped,
        SUM(CASE WHEN im.transaction_type = 'in' THEN im.quantity ELSE -im.quantity END) AS net_change
    FROM inventory_movements im
    JOIN products p ON im.product_id = p.id
    WHERE im.transaction_date >= DATE_SUB(CURRENT_DATE, INTERVAL months_back MONTH)
    GROUP BY DATE_FORMAT(im.transaction_date, '%Y-%m'), p.category
    ORDER BY month, p.category;
END //
DELIMITER ;

-- ====================================================================================
-- CUSTOMER REPORTS - QUERIES AND PROCEDURES
-- ====================================================================================

-- Customer Distribution by State
-- Used for Customer Overview Report
DELIMITER //
CREATE PROCEDURE GetCustomersByState()
BEGIN
    SELECT 
        state,
        COUNT(*) AS customer_count,
        ROUND((COUNT(*) / (SELECT COUNT(*) FROM customers)) * 100, 2) AS percentage
    FROM customers
    GROUP BY state
    ORDER BY customer_count DESC;
END //
DELIMITER ;

-- Customer Spending Analysis
-- Used for Customer Reports
DELIMITER //
CREATE PROCEDURE GetCustomerSpendingAnalysis(IN months_back INT)
BEGIN
    SELECT 
        c.id,
        c.name,
        c.state,
        COUNT(o.id) AS order_count,
        SUM(o.total_amount) AS total_spent,
        AVG(o.total_amount) AS avg_order_value,
        MAX(o.order_date) AS last_order_date,
        DATEDIFF(CURRENT_DATE, MAX(o.order_date)) AS days_since_last_order
    FROM customers c
    LEFT JOIN orders o ON c.id = o.customer_id AND o.order_date >= DATE_SUB(CURRENT_DATE, INTERVAL months_back MONTH)
    GROUP BY c.id, c.name, c.state
    ORDER BY total_spent DESC;
END //
DELIMITER ;

-- Customer Acquisition Trends
-- Used for Customer Reports
DELIMITER //
CREATE PROCEDURE GetCustomerAcquisitionTrends(IN months_back INT)
BEGIN
    SELECT 
        DATE_FORMAT(registration_date, '%Y-%m') AS month,
        COUNT(*) AS new_customers,
        SUM(COUNT(*)) OVER (ORDER BY DATE_FORMAT(registration_date, '%Y-%m')) AS cumulative_customers
    FROM customers
    WHERE registration_date >= DATE_SUB(CURRENT_DATE, INTERVAL months_back MONTH)
    GROUP BY DATE_FORMAT(registration_date, '%Y-%m')
    ORDER BY month;
END //
DELIMITER ;

-- Customer Retention Analysis
-- Used for Customer Reports
DELIMITER //
CREATE PROCEDURE GetCustomerRetentionAnalysis(IN analysis_year INT)
BEGIN
    WITH monthly_active AS (
        SELECT 
            c.id AS customer_id,
            MONTH(o.order_date) AS order_month
        FROM customers c
        JOIN orders o ON c.id = o.customer_id
        WHERE YEAR(o.order_date) = analysis_year
        GROUP BY c.id, MONTH(o.order_date)
    ),
    retention_matrix AS (
        SELECT 
            first_month,
            order_month,
            COUNT(DISTINCT customer_id) AS customer_count
        FROM (
            SELECT 
                customer_id,
                MIN(order_month) AS first_month,
                order_month
            FROM monthly_active
            GROUP BY customer_id, order_month
        ) customer_months
        GROUP BY first_month, order_month
        ORDER BY first_month, order_month
    )
    
    SELECT 
        first_month,
        MAX(CASE WHEN (order_month - first_month) = 0 THEN customer_count ELSE 0 END) AS month_0,
        MAX(CASE WHEN (order_month - first_month) = 1 THEN customer_count ELSE 0 END) AS month_1,
        MAX(CASE WHEN (order_month - first_month) = 2 THEN customer_count ELSE 0 END) AS month_2,
        MAX(CASE WHEN (order_month - first_month) = 3 THEN customer_count ELSE 0 END) AS month_3,
        MAX(CASE WHEN (order_month - first_month) = 4 THEN customer_count ELSE 0 END) AS month_4,
        MAX(CASE WHEN (order_month - first_month) = 5 THEN customer_count ELSE 0 END) AS month_5,
        MAX(CASE WHEN (order_month - first_month) = 6 THEN customer_count ELSE 0 END) AS month_6,
        MAX(CASE WHEN (order_month - first_month) = 7 THEN customer_count ELSE 0 END) AS month_7,
        MAX(CASE WHEN (order_month - first_month) = 8 THEN customer_count ELSE 0 END) AS month_8,
        MAX(CASE WHEN (order_month - first_month) = 9 THEN customer_count ELSE 0 END) AS month_9,
        MAX(CASE WHEN (order_month - first_month) = 10 THEN customer_count ELSE 0 END) AS month_10,
        MAX(CASE WHEN (order_month - first_month) = 11 THEN customer_count ELSE 0 END) AS month_11
    FROM retention_matrix
    GROUP BY first_month
    ORDER BY first_month;
END //
DELIMITER ;

-- Customer Order Details
-- Used for Customer Reports
DELIMITER //
CREATE PROCEDURE GetCustomerOrderDetails(IN customer_id VARCHAR(10))
BEGIN
    SELECT 
        o.id AS order_id,
        o.order_date,
        o.status,
        o.total_amount,
        COUNT(od.product_id) AS items_count,
        GROUP_CONCAT(p.name SEPARATOR ', ') AS products
    FROM orders o
    JOIN order_details od ON o.id = od.order_id
    JOIN products p ON od.product_id = p.id
    WHERE o.customer_id = customer_id
    GROUP BY o.id, o.order_date, o.status, o.total_amount
    ORDER BY o.order_date DESC;
END //
DELIMITER ;

-- ====================================================================================
-- VIEWS - For easier data access
-- ====================================================================================

-- Monthly Sales Summary View
CREATE OR REPLACE VIEW monthly_sales_summary AS
SELECT 
    DATE_FORMAT(o.order_date, '%Y-%m') AS month,
    COUNT(DISTINCT o.id) AS order_count,
    COUNT(DISTINCT o.customer_id) AS customer_count,
    SUM(o.total_amount) AS total_revenue,
    AVG(o.total_amount) AS avg_order_value,
    SUM(od.quantity) AS items_sold,
    COUNT(DISTINCT od.product_id) AS unique_products_sold
FROM orders o
JOIN order_details od ON o.id = od.order_id
GROUP BY DATE_FORMAT(o.order_date, '%Y-%m')
ORDER BY month;

-- Product Performance View
CREATE OR REPLACE VIEW product_performance AS
SELECT 
    p.id,
    p.name,
    p.category,
    p.price,
    i.quantity AS current_stock,
    COUNT(DISTINCT od.order_id) AS times_ordered,
    SUM(od.quantity) AS units_sold,
    SUM(od.price * od.quantity) AS revenue,
    (SUM(od.price * od.quantity) / SUM(od.quantity)) AS avg_selling_price,
    (p.price * i.quantity) AS inventory_value
FROM products p
LEFT JOIN inventory i ON p.id = i.product_id
LEFT JOIN order_details od ON p.id = od.product_id
LEFT JOIN orders o ON od.order_id = o.id AND o.order_date >= DATE_SUB(CURRENT_DATE, INTERVAL 12 MONTH)
GROUP BY p.id, p.name, p.category, p.price, i.quantity
ORDER BY revenue DESC;

-- Customer Insights View
CREATE OR REPLACE VIEW customer_insights AS
SELECT 
    c.id,
    c.name,
    c.email,
    c.phone,
    c.city,
    c.state,
    c.zipcode,
    MIN(o.order_date) AS first_order_date,
    MAX(o.order_date) AS last_order_date,
    COUNT(o.id) AS lifetime_orders,
    SUM(o.total_amount) AS lifetime_value,
    AVG(o.total_amount) AS avg_order_value,
    DATEDIFF(CURRENT_DATE, MAX(o.order_date)) AS days_since_last_order,
    (SELECT GROUP_CONCAT(DISTINCT p.category ORDER BY p.category SEPARATOR ', ')
     FROM orders o2
     JOIN order_details od ON o2.id = od.order_id
     JOIN products p ON od.product_id = p.id
     WHERE o2.customer_id = c.id) AS preferred_categories
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
GROUP BY c.id, c.name, c.email, c.phone, c.city, c.state, c.zipcode;

-- Inventory Status View
CREATE OR REPLACE VIEW inventory_status AS
SELECT 
    p.id AS product_id,
    p.name AS product_name,
    p.category,
    i.quantity AS current_stock,
    i.reorder_level,
    CASE 
        WHEN i.quantity = 0 THEN 'Out of Stock'
        WHEN i.quantity <= i.reorder_level THEN 'Low Stock'
        ELSE 'In Stock'
    END AS status,
    p.price AS unit_price,
    (p.price * i.quantity) AS inventory_value,
    i.last_updated
FROM inventory i
JOIN products p ON i.product_id = p.id;

-- ====================================================================================
-- TRIGGERS - For data integrity and automated reporting
-- ====================================================================================

-- Trigger to update inventory when order is placed
DELIMITER //
CREATE TRIGGER after_order_details_insert
AFTER INSERT ON order_details
FOR EACH ROW
BEGIN
    -- Update inventory
    UPDATE inventory
    SET quantity = quantity - NEW.quantity,
        last_updated = CURRENT_TIMESTAMP
    WHERE product_id = NEW.product_id;
    
    -- Check if inventory is low and create alert if needed
    INSERT INTO inventory_alerts (product_id, alert_type, alert_message, created_at)
    SELECT 
        i.product_id,
        'Low Stock',
        CONCAT('Product "', p.name, '" is low on stock. Current level: ', i.quantity, ', Reorder level: ', i.reorder_level),
        CURRENT_TIMESTAMP
    FROM inventory i
    JOIN products p ON i.product_id = p.id
    WHERE i.product_id = NEW.product_id
    AND i.quantity <= i.reorder_level
    AND NOT EXISTS (
        SELECT 1 FROM inventory_alerts 
        WHERE product_id = i.product_id 
        AND alert_type = 'Low Stock'
        AND resolved = 0
    );
END //
DELIMITER ;

-- Trigger to update inventory when order is cancelled or returned
DELIMITER //
CREATE TRIGGER after_order_status_update
AFTER UPDATE ON orders
FOR EACH ROW
BEGIN
    -- If order was cancelled or returned, restore inventory
    IF (NEW.status = 'Cancelled' OR NEW.status = 'Returned') AND OLD.status NOT IN ('Cancelled', 'Returned') THEN
        UPDATE inventory i
        JOIN order_details od ON i.product_id = od.product_id
        SET i.quantity = i.quantity + od.quantity,
            i.last_updated = CURRENT_TIMESTAMP
        WHERE od.order_id = NEW.id;
    END IF;
END //
DELIMITER ;

-- Trigger to log product price changes
DELIMITER //
CREATE TRIGGER after_product_price_update
AFTER UPDATE ON products
FOR EACH ROW
BEGIN
    IF NEW.price != OLD.price THEN
        INSERT INTO price_history (product_id, old_price, new_price, change_date, change_percentage)
        VALUES (
            NEW.id,
            OLD.price,
            NEW.price,
            CURRENT_TIMESTAMP,
            ROUND(((NEW.price - OLD.price) / OLD.price) * 100, 2)
        );
    END IF;
END //
DELIMITER ;

-- Trigger to update product last_updated timestamp
DELIMITER //
CREATE TRIGGER before_product_update
BEFORE UPDATE ON products
FOR EACH ROW
BEGIN
    SET NEW.last_updated = CURRENT_TIMESTAMP;
END //
DELIMITER ;

-- Trigger to track customer order frequency
DELIMITER //
CREATE TRIGGER after_order_insert
AFTER INSERT ON orders
FOR EACH ROW
BEGIN
    -- Update customer_stats table with new order information
    INSERT INTO customer_stats (customer_id, total_orders, total_spent, avg_order_value, last_order_date)
    VALUES (
        NEW.customer_id,
        1,
        NEW.total_amount,
        NEW.total_amount,
        NEW.order_date
    )
    ON DUPLICATE KEY UPDATE
        total_orders = total_orders + 1,
        total_spent = total_spent + NEW.total_amount,
        avg_order_value = (total_spent + NEW.total_amount) / (total_orders + 1),
        last_order_date = GREATEST(last_order_date, NEW.order_date);
END //
DELIMITER ;

-- ====================================================================================
-- STORED PROCEDURES - For recurring report generation
-- ====================================================================================

-- Daily Sales Summary Procedure
DELIMITER //
CREATE PROCEDURE GenerateDailySalesSummary(IN report_date DATE)
BEGIN
    INSERT INTO daily_sales_summary (
        summary_date,
        total_orders,
        total_revenue,
        avg_order_value,
        unique_customers,
        items_sold,
        top_category,
        top_product
    )
    WITH daily_sales AS (
        SELECT 
            COUNT(DISTINCT o.id) AS total_orders,
            SUM(o.total_amount) AS total_revenue,
            AVG(o.total_amount) AS avg_order_value,
            COUNT(DISTINCT o.customer_id) AS unique_customers,
            SUM(od.quantity) AS items_sold
        FROM orders o
        JOIN order_details od ON o.id = od.order_id
        WHERE DATE(o.order_date) = report_date
    ),
    category_sales AS (
        SELECT 
            p.category,
            SUM(od.price * od.quantity) AS category_revenue
        FROM order_details od
        JOIN products p ON od.product_id = p.id
        JOIN orders o ON od.order_id = o.id
        WHERE DATE(o.order_date) = report_date
        GROUP BY p.category
        ORDER BY category_revenue DESC
        LIMIT 1
    ),
    product_sales AS (
        SELECT 
            p.name AS product_name,
            SUM(od.quantity) AS quantity_sold
        FROM order_details od
        JOIN products p ON od.product_id = p.id
        JOIN orders o ON od.order_id = o.id
        WHERE DATE(o.order_date) = report_date
        GROUP BY p.id, p.name
        ORDER BY quantity_sold DESC
        LIMIT 1
    )
    SELECT 
        report_date,
        ds.total_orders,
        ds.total_revenue,
        ds.avg_order_value,
        ds.unique_customers,
        ds.items_sold,
        cs.category,
        ps.product_name
    FROM daily_sales ds
    CROSS JOIN category_sales cs
    CROSS JOIN product_sales ps;
END //
DELIMITER ;

-- Monthly Financial Report Procedure
DELIMITER //
CREATE PROCEDURE GenerateMonthlyFinancialReport(IN year INT, IN month INT)
BEGIN
    DECLARE start_date DATE;
    DECLARE end_date DATE;
    
    SET start_date = DATE(CONCAT(year, '-', month, '-01'));
    SET end_date = LAST_DAY(start_date);
    
    -- Insert into monthly_financial_reports table
    INSERT INTO monthly_financial_reports (
        report_month,
        total_revenue,
        total_expenses,
        net_profit,
        profit_margin,
        order_count,
        customer_count,
        avg_order_value,
        generated_on
    )
    SELECT 
        start_date,
        COALESCE(SUM(CASE WHEN transaction_type = 'revenue' THEN amount ELSE 0 END), 0) AS total_revenue,
        COALESCE(SUM(CASE WHEN transaction_type = 'expense' THEN amount ELSE 0 END), 0) AS total_expenses,
        COALESCE(SUM(CASE WHEN transaction_type = 'revenue' THEN amount 
                          WHEN transaction_type = 'expense' THEN -amount END), 0) AS net_profit,
        CASE 
            WHEN SUM(CASE WHEN transaction_type = 'revenue' THEN amount ELSE 0 END) > 0 
            THEN ROUND((SUM(CASE WHEN transaction_type = 'revenue' THEN amount 
                              WHEN transaction_type = 'expense' THEN -amount END) / 
                    SUM(CASE WHEN transaction_type = 'revenue' THEN amount ELSE 0 END)) * 100, 2)
            ELSE 0
        END AS profit_margin,
        (SELECT COUNT(*) FROM orders WHERE order_date BETWEEN start_date AND end_date) AS order_count,
        (SELECT COUNT(DISTINCT customer_id) FROM orders WHERE order_date BETWEEN start_date AND end_date) AS customer_count,
        (SELECT AVG(total_amount) FROM orders WHERE order_date BETWEEN start_date AND end_date) AS avg_order_value,
        CURRENT_TIMESTAMP
    FROM financial_transactions
    WHERE transaction_date BETWEEN start_date AND end_date;
    
    -- Now generate detailed category analysis
    INSERT INTO monthly_category_performance (
        report_month,
        category,
        revenue,
        items_sold,
        order_count,
        avg_price,
        percentage_of_total
    )
    WITH category_totals AS (
        SELECT 
            p.category,
            SUM(od.price * od.quantity) AS revenue,
            SUM(od.quantity) AS items_sold,
            COUNT(DISTINCT o.id) AS order_count,
            AVG(od.price) AS avg_price
        FROM orders o
        JOIN order_details od ON o.id = od.order_id
        JOIN products p ON od.product_id = p.id
        WHERE o.order_date BETWEEN start_date AND end_date
        GROUP BY p.category
    ),
    total_revenue AS (
        SELECT SUM(revenue) AS total FROM category_totals
    )
    SELECT 
        start_date,
        ct.category,
        ct.revenue,
        ct.items_sold,
        ct.order_count,
        ct.avg_price,
        ROUND((ct.revenue / tr.total) * 100, 2) AS percentage_of_total
    FROM category_totals ct
    CROSS JOIN total_revenue tr
    ORDER BY ct.revenue DESC;
END //
DELIMITER ;

-- Inventory Age Report Procedure
DELIMITER //
CREATE PROCEDURE GenerateInventoryAgeReport()
BEGIN
    INSERT INTO inventory_age_reports (
        report_date,
        age_group,
        category,
        item_count,
        total_quantity,
        inventory_value,
        percentage_of_total_value
    )
    WITH age_analysis AS (
        SELECT 
            CASE 
                WHEN DATEDIFF(CURRENT_DATE, i.received_date) <= 30 THEN '0-30 days'
                WHEN DATEDIFF(CURRENT_DATE, i.received_date) <= 60 THEN '31-60 days'
                WHEN DATEDIFF(CURRENT_DATE, i.received_date) <= 90 THEN '61-90 days'
                ELSE 'Over 90 days'
            END AS age_group,
            p.category,
            COUNT(*) AS item_count,
            SUM(i.quantity) AS total_quantity,
            SUM(p.price * i.quantity) AS inventory_value
        FROM inventory i
        JOIN products p ON i.product_id = p.id
        GROUP BY age_group, p.category
    ),
    total_value AS (
        SELECT SUM(inventory_value) AS total FROM age_analysis
    )
    SELECT 
        CURRENT_DATE,
        aa.age_group,
        aa.category,
        aa.item_count,
        aa.total_quantity,
        aa.inventory_value,
        ROUND((aa.inventory_value / tv.total) * 100, 2) AS percentage_of_total_value
    FROM age_analysis aa
    CROSS JOIN total_value tv
    ORDER BY aa.age_group, aa.inventory_value DESC;
END //
DELIMITER ;

-- Customer Segment Analysis Procedure
DELIMITER //
CREATE PROCEDURE GenerateCustomerSegmentation()
BEGIN
    -- RFM (Recency, Frequency, Monetary) Segmentation
    WITH customer_rfm AS (
        SELECT 
            c.id,
            c.name,
            c.email,
            DATEDIFF(CURRENT_DATE, MAX(o.order_date)) AS recency,
            COUNT(o.id) AS frequency,
            SUM(o.total_amount) AS monetary,
            NTILE(5) OVER (ORDER BY DATEDIFF(CURRENT_DATE, MAX(o.order_date)) DESC) AS r_score,
            NTILE(5) OVER (ORDER BY COUNT(o.id) ASC) AS f_score,
            NTILE(5) OVER (ORDER BY SUM(o.total_amount) ASC) AS m_score
        FROM customers c
        LEFT JOIN orders o ON c.id = o.customer_id
        GROUP BY c.id, c.name, c.email
    ),
    rfm_combined AS (
        SELECT 
            *,
            CONCAT(r_score, f_score, m_score) AS rfm_score,
            CASE 
                WHEN (r_score >= 4 AND f_score >= 4 AND m_score >= 4) THEN 'Champion'
                WHEN (r_score >= 3 AND f_score >= 3 AND m_score >= 3) THEN 'Loyal Customer'
                WHEN (r_score >= 3 AND f_score >= 1 AND m_score >= 2) THEN 'Potential Loyalist'
                WHEN (r_score >= 4 AND f_score <= 2 AND m_score <= 2) THEN 'New Customer'
                WHEN (r_score >= 4 AND f_score <= 1 AND m_score <= 1) THEN 'Promising'
                WHEN (r_score <= 2 AND f_score >= 3 AND m_score >= 3) THEN 'At Risk'
                WHEN (r_score <= 1 AND f_score >= 4 AND m_score >= 4) THEN 'Can\'t Lose Them'
                WHEN (r_score <= 1 AND f_score <= 2 AND m_score <= 2) THEN 'Hibernating'
                WHEN (r_score <= 1 AND f_score <= 1 AND m_score <= 1) THEN 'Lost'
                ELSE 'Regular Customer'
            END AS segment
        FROM customer_rfm
    )
    
    -- Insert into customer_segmentation table
    INSERT INTO customer_segmentation (
        customer_id,
        segment,
        recency_days,
        frequency,
        monetary_value,
        rfm_score,
        analysis_date
    )
    SELECT 
        id,
        segment,
        recency,
        frequency,
        monetary,
        rfm_score,
        CURRENT_DATE
    FROM rfm_combined;
    
    -- Generate segment summary
    INSERT INTO segment_summary (
        analysis_date,
        segment,
        customer_count,
        avg_recency,
        avg_frequency,
        avg_monetary,
        total_revenue,
        percentage_of_customers
    )
    WITH totals AS (
        SELECT COUNT(*) AS total_customers FROM customer_rfm
    )
    SELECT 
        CURRENT_DATE,
        r.segment,
        COUNT(*) AS customer_count,
        AVG(r.recency) AS avg_recency,
        AVG(r.frequency) AS avg_frequency,
        AVG(r.monetary) AS avg_monetary,
        SUM(r.monetary) AS total_revenue,
        ROUND((COUNT(*) / t.total_customers) * 100, 2) AS percentage_of_customers
    FROM rfm_combined r
    CROSS JOIN totals t
    GROUP BY r.segment, t.total_customers
    ORDER BY total_revenue DESC;
END //
DELIMITER ;

-- ====================================================================================
-- EVENTS - For scheduled report generation
-- ====================================================================================

-- Enable MySQL Event Scheduler
SET GLOBAL event_scheduler = ON;

-- Daily Sales Summary Event
DELIMITER //
CREATE EVENT daily_sales_summary_event
ON SCHEDULE EVERY 1 DAY
STARTS CURRENT_DATE + INTERVAL 23 HOUR + INTERVAL 55 MINUTE
DO
BEGIN
    CALL GenerateDailySalesSummary(CURRENT_DATE);
END //
DELIMITER ;

-- Monthly Financial Report Event (runs on first day of each month)
DELIMITER //
CREATE EVENT monthly_financial_report_event
ON SCHEDULE EVERY 1 MONTH
STARTS DATE_FORMAT(DATE_ADD(CURRENT_DATE, INTERVAL 1 MONTH), '%Y-%m-01')
DO
BEGIN
    CALL GenerateMonthlyFinancialReport(
        YEAR(DATE_SUB(CURRENT_DATE, INTERVAL 1 MONTH)),
        MONTH(DATE_SUB(CURRENT_DATE, INTERVAL 1 MONTH))
    );
END //
DELIMITER ;

-- Weekly Inventory Age Report Event
DELIMITER //
CREATE EVENT weekly_inventory_age_report_event
ON SCHEDULE EVERY 1 WEEK
STARTS CURRENT_DATE + INTERVAL 1 DAY
DO
BEGIN
    CALL GenerateInventoryAgeReport();
END //
DELIMITER ;

-- Quarterly Customer Segmentation Analysis
DELIMITER //
CREATE EVENT quarterly_customer_segmentation_event
ON SCHEDULE EVERY 3 MONTH
STARTS DATE_FORMAT(DATE_ADD(CURRENT_DATE, INTERVAL 3 MONTH), '%Y-%m-01')
DO
BEGIN
    CALL GenerateCustomerSegmentation();
END //
DELIMITER ;

-- ====================================================================================
-- TABLE CREATION - Schema for the database tables
-- ====================================================================================

-- Products Table
CREATE TABLE products (
    id VARCHAR(10) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    cost DECIMAL(10,2),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_product_category (category)
);

-- Inventory Table
CREATE TABLE inventory (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id VARCHAR(10) NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    reorder_level INT NOT NULL DEFAULT 10,
    received_date DATE,
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id),
    INDEX idx_inventory_product (product_id)
);

-- Inventory Movements Table
CREATE TABLE inventory_movements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id VARCHAR(10) NOT NULL,
    transaction_type ENUM('in', 'out', 'adjustment') NOT NULL,
    quantity INT NOT NULL,
    transaction_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    reference_id VARCHAR(50),
    notes TEXT,
    FOREIGN KEY (product_id) REFERENCES products(id),
    INDEX idx_movement_product (product_id),
    INDEX idx_movement_date (transaction_date)
);

-- Inventory Alerts Table
CREATE TABLE inventory_alerts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id VARCHAR(10) NOT NULL,
    alert_type VARCHAR(50) NOT NULL,
    alert_message TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    resolved BOOLEAN DEFAULT FALSE,
    resolved_at DATETIME,
    FOREIGN KEY (product_id) REFERENCES products(id),
    INDEX idx_alert_product (product_id),
    INDEX idx_alert_resolved (resolved)
);

-- Customers Table
CREATE TABLE customers (
    id VARCHAR(10) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    address VARCHAR(200),
    city VARCHAR(50) NOT NULL,
    state VARCHAR(50) NOT NULL,
    zipcode VARCHAR(20) NOT NULL,
    region VARCHAR(50),
    registration_date DATE DEFAULT (CURRENT_DATE),
    INDEX idx_customer_state (state),
    INDEX idx_customer_region (region)
);

-- Orders Table
CREATE TABLE orders (
    id VARCHAR(10) PRIMARY KEY,
    customer_id VARCHAR(10) NOT NULL,
    order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    status ENUM('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned') DEFAULT 'Pending',
    total_amount DECIMAL(12,2) NOT NULL,
    payment_method VARCHAR(50),
    shipping_address VARCHAR(255),
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    INDEX idx_order_customer (customer_id),
    INDEX idx_order_date (order_date),
    INDEX idx_order_status (status)
);

-- Order Details Table
CREATE TABLE order_details (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id VARCHAR(10) NOT NULL,
    product_id VARCHAR(10) NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    discount DECIMAL(10,2) DEFAULT 0,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id),
    UNIQUE KEY order_product (order_id, product_id),
    INDEX idx_orderdetail_product (product_id)
);

-- Price History Table
CREATE TABLE price_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id VARCHAR(10) NOT NULL,
    old_price DECIMAL(10,2) NOT NULL,
    new_price DECIMAL(10,2) NOT NULL,
    change_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    change_percentage DECIMAL(5,2),
    FOREIGN KEY (product_id) REFERENCES products(id),
    INDEX idx_pricehistory_product (product_id),
    INDEX idx_pricehistory_date (change_date)
);

-- Financial Transactions Table
CREATE TABLE financial_transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    transaction_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    transaction_type ENUM('revenue', 'expense', 'transfer') NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT,
    reference_id VARCHAR(50),
    INDEX idx_transaction_date (transaction_date),
    INDEX idx_transaction_type (transaction_type),
    INDEX idx_transaction_category (category)
);

-- Cash Flow Transactions Table
CREATE TABLE cash_flow_transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    transaction_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    amount DECIMAL(12,2) NOT NULL,
    flow_category ENUM('operating', 'investing', 'financing') NOT NULL,
    description TEXT,
    reference_id VARCHAR(50),
    INDEX idx_cashflow_date (transaction_date),
    INDEX idx_cashflow_category (flow_category)
);

-- Assets Table
CREATE TABLE assets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    asset_id VARCHAR(50),
    asset_name VARCHAR(100) NOT NULL,
    asset_type ENUM('current', 'fixed') NOT NULL,
    purchase_date DATE,
    original_value DECIMAL(12,2) NOT NULL,
    current_value DECIMAL(12,2) NOT NULL,
    valuation_date DATE DEFAULT (CURRENT_DATE),
    notes TEXT,
    INDEX idx_asset_id (asset_id),
    INDEX idx_asset_type (asset_type),
    INDEX idx_asset_valuation (valuation_date)
);

-- Liabilities Table
CREATE TABLE liabilities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    liability_id VARCHAR(50),
    liability_name VARCHAR(100) NOT NULL,
    liability_type ENUM('current', 'long-term') NOT NULL,
    start_date DATE,
    original_amount DECIMAL(12,2) NOT NULL,
    current_amount DECIMAL(12,2) NOT NULL,
    valuation_date DATE DEFAULT (CURRENT_DATE),
    notes TEXT,
    INDEX idx_liability_id (liability_id),
    INDEX idx_liability_type (liability_type),
    INDEX idx_liability_valuation (valuation_date)
);

-- Equity Table
CREATE TABLE equity (
    id INT AUTO_INCREMENT PRIMARY KEY,
    equity_id VARCHAR(50),
    equity_name VARCHAR(100) NOT NULL,
    original_amount DECIMAL(12,2) NOT NULL,
    current_amount DECIMAL(12,2) NOT NULL,
    valuation_date DATE DEFAULT (CURRENT_DATE),
    notes TEXT,
    INDEX idx_equity_id (equity_id),
    INDEX idx_equity_valuation (valuation_date)
);

-- Customer Stats Table
CREATE TABLE customer_stats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id VARCHAR(10) NOT NULL,
    total_orders INT DEFAULT 0,
    total_spent DECIMAL(12,2) DEFAULT 0,
    avg_order_value DECIMAL(10,2) DEFAULT 0,
    first_order_date DATETIME,
    last_order_date DATETIME,
    UNIQUE KEY unique_customer (customer_id),
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    INDEX idx_customerstats_spent (total_spent)
);

-- Daily Sales Summary Table
CREATE TABLE daily_sales_summary (
    id INT AUTO_INCREMENT PRIMARY KEY,
    summary_date DATE UNIQUE,
    total_orders INT DEFAULT 0,
    total_revenue DECIMAL(12,2) DEFAULT 0,
    avg_order_value DECIMAL(10,2) DEFAULT 0,
    unique_customers INT DEFAULT 0,
    items_sold INT DEFAULT 0,
    top_category VARCHAR(50),
    top_product VARCHAR(100),
    INDEX idx_summary_date (summary_date)
);

-- Monthly Financial Reports Table
CREATE TABLE monthly_financial_reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    report_month DATE UNIQUE,
    total_revenue DECIMAL(12,2) DEFAULT 0,
    total_expenses DECIMAL(12,2) DEFAULT 0,
    net_profit DECIMAL(12,2) DEFAULT 0,
    profit_margin DECIMAL(5,2) DEFAULT 0,
    order_count INT DEFAULT 0,
    customer_count INT DEFAULT 0,
    avg_order_value DECIMAL(10,2) DEFAULT 0,
    generated_on DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_report_month (report_month)
);

-- Monthly Category Performance Table
CREATE TABLE monthly_category_performance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    report_month DATE,
    category VARCHAR(50),
    revenue DECIMAL(12,2) DEFAULT 0,
    items_sold INT DEFAULT 0,
    order_count INT DEFAULT 0,
    avg_price DECIMAL(10,2) DEFAULT 0,
    percentage_of_total DECIMAL(5,2) DEFAULT 0,
    UNIQUE KEY month_category (report_month, category),
    INDEX idx_category_report_month (report_month)
);

-- Inventory Age Reports Table
CREATE TABLE inventory_age_reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    report_date DATE,
    age_group VARCHAR(20),
    category VARCHAR(50),
    item_count INT DEFAULT 0,
    total_quantity INT DEFAULT 0,
    inventory_value DECIMAL(12,2) DEFAULT 0,
    percentage_of_total_value DECIMAL(5,2) DEFAULT 0,
    UNIQUE KEY report_age_category (report_date, age_group, category),
    INDEX idx_inventory_report_date (report_date)
);

-- Customer Segmentation Table
CREATE TABLE customer_segmentation (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id VARCHAR(10) NOT NULL,
    segment VARCHAR(50) NOT NULL,
    recency_days INT,
    frequency INT,
    monetary_value DECIMAL(12,2),
    rfm_score VARCHAR(3),
    analysis_date DATE,
    UNIQUE KEY customer_analysis_date (customer_id, analysis_date),
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    INDEX idx_segment_analysis_date (analysis_date)
);

-- Segment Summary Table
CREATE TABLE segment_summary (
    id INT AUTO_INCREMENT PRIMARY KEY,
    analysis_date DATE,
    segment VARCHAR(50),
    customer_count INT DEFAULT 0,
    avg_recency DECIMAL(10,2) DEFAULT 0,
    avg_frequency DECIMAL(10,2) DEFAULT 0,
    avg_monetary DECIMAL(12,2) DEFAULT 0,
    total_revenue DECIMAL(12,2) DEFAULT 0,
    percentage_of_customers DECIMAL(5,2) DEFAULT 0,
    UNIQUE KEY segment_analysis_date (segment, analysis_date),
    INDEX idx_summary_analysis_date (analysis_date)
);
