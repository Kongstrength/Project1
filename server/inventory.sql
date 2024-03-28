-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: db:3306
-- Generation Time: Mar 28, 2024 at 09:17 AM
-- Server version: 8.3.0
-- PHP Version: 8.2.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `webdb`
--

-- --------------------------------------------------------

--
-- Table structure for table `inventory`
--

CREATE TABLE `inventory` (
  `id` int NOT NULL,
  `product_id` int NOT NULL COMMENT 'รหัสสินค้า',
  `product_name` varchar(255) NOT NULL COMMENT 'ชื่อสินค้า',
  `quantity_in_stock` int NOT NULL COMMENT 'จำนวนคงเหลือ',
  `unit_price` decimal(10,2) NOT NULL COMMENT 'ราคาต่อหน่วย',
  `transaction_date` datetime NOT NULL COMMENT 'วันที่เบิกจ่าย',
  `quantity` int NOT NULL COMMENT 'จำนวนสินค้าจะเบิก',
  `person_in_charge` varchar(255) NOT NULL COMMENT 'ผู้รับผิดชอบ',
  `product_logist` enum('สั่งซื้อสินค้า','เพิ่มจำนวนสต๊อก','ยกเลิกคำสั่งซื้อ') NOT NULL,
  `remaining_quantity` int GENERATED ALWAYS AS ((case when (`product_logist` = _utf8mb4'สั่งซื้อสินค้า') then (`quantity_in_stock` - `quantity`) when (`product_logist` = _utf8mb4'เพิ่มจำนวนสต๊อก') then (`quantity_in_stock` + `quantity`) when (`product_logist` = _utf8mb4'ยกเลิกคำสั่งซื้อ') then `quantity_in_stock` else NULL end)) STORED
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `inventory`
--

INSERT INTO `inventory` (`id`, `product_id`, `product_name`, `quantity_in_stock`, `unit_price`, `transaction_date`, `quantity`, `person_in_charge`, `product_logist`) VALUES
(1, 1000, 'Product A', 22, 50.00, '2024-03-28 15:31:00', 10, 'John', 'สั่งซื้อสินค้า'),
(2, 1001, 'Product B', 20, 50.00, '2024-03-28 14:55:00', 20, 'John', 'เพิ่มจำนวนสต๊อก'),
(3, 1002, 'Product C', 20, 50.00, '2024-03-29 12:27:00', 5, 'John', 'สั่งซื้อสินค้า'),
(4, 1003, 'KFC', 1000, 125.56, '2024-03-28 13:11:00', 100, 'Sitthaphop', 'สั่งซื้อสินค้า'),
(5, 1004, 'HyperX', 100, 2000.00, '2024-03-29 19:47:00', 10, 'Mr.K', 'สั่งซื้อสินค้า'),
(6, 1005, 'หงส์ไทย', 10000, 30.00, '2024-03-29 12:27:00', 100, 'Mr.S', 'สั่งซื้อสินค้า'),
(7, 1006, 'Samsung', 50000, 25000.00, '2024-03-28 13:41:00', 100, 'MR.V', 'สั่งซื้อสินค้า'),
(8, 1007, 'วิตามินซี', 10000, 15.00, '2024-03-28 15:16:00', 10, 'Mr.E', 'สั่งซื้อสินค้า'),
(9, 1008, 'แม็คเย็บกระดาษ', 1000, 40.00, '2024-03-28 13:41:00', 10, 'MR.K', 'สั่งซื้อสินค้า'),
(10, 1009, 'IPAD', 10000, 10000.00, '2024-03-28 13:42:00', 5000, 'Steve', 'สั่งซื้อสินค้า'),
(11, 1010, 'จอมอนิเตอร์', 1000, 2500.00, '2024-03-28 13:43:00', 20, 'MR.K', 'สั่งซื้อสินค้า'),
(12, 1011, 'ไฟฉาย', 100, 50.00, '2024-03-28 13:42:00', 5, 'John', 'สั่งซื้อสินค้า'),
(13, 1012, 'สาย Usb Type-C', 20000, 100.00, '2024-03-28 13:44:00', 100, 'John', 'สั่งซื้อสินค้า'),
(14, 1013, 'น้ำเปล่า', 100000, 10.00, '2024-03-28 15:22:00', 0, 'Mr.Sitthaphop', 'สั่งซื้อสินค้า'),
(15, 1014, 'ปลั๊กไฟ', 1000, 250.00, '2024-03-28 13:47:00', 100, 'Mr.M', 'สั่งซื้อสินค้า');

--
-- Triggers `inventory`
--
DELIMITER $$
CREATE TRIGGER `update_remaining_quantity` AFTER INSERT ON `inventory` FOR EACH ROW BEGIN
    DECLARE change_quantity INT;
    IF NEW.product_logist = 'เพิ่มจำนวนสต๊อก' OR NEW.product_logist = 'แก้ไขสินค้า' THEN
        SET change_quantity = NEW.quantity;
    ELSE
        SET change_quantity = -NEW.quantity;
    END IF;

    UPDATE inventory
    SET remaining_quantity = remaining_quantity + change_quantity
    WHERE id = NEW.id;
END
$$
DELIMITER ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `inventory`
--
ALTER TABLE `inventory`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `inventory`
--
ALTER TABLE `inventory`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
