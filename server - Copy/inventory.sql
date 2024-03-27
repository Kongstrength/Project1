-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: db:3306
-- Generation Time: Mar 27, 2024 at 08:41 AM
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
  `product_logist` int NOT NULL COMMENT 'การเคลื่อนไหวของสินค้า	',
  `remaining_quantity` int GENERATED ALWAYS AS ((`quantity_in_stock` - `quantity`)) STORED
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `inventory`
--

INSERT INTO `inventory` (`id`, `product_id`, `product_name`, `quantity_in_stock`, `unit_price`, `transaction_date`, `quantity`, `person_in_charge`, `product_logist`) VALUES
(1, 1001, 'Product A', 10, 50.00, '2024-03-27 00:00:00', 5, 'John', 5);

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
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
