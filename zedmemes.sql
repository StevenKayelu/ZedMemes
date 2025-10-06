-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 18, 2025 at 04:06 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `zedmemes`
--

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`) VALUES
(2, 'jokes'),
(3, 'relationships'),
(1, 'school'),
(6, 'sports'),
(4, 'work');

-- --------------------------------------------------------

--
-- Table structure for table `memes`
--

CREATE TABLE `memes` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `filename` varchar(255) NOT NULL,
  `caption` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `likes` int(11) DEFAULT 0,
  `upvotes` int(11) DEFAULT 0,
  `category_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `memes`
--

INSERT INTO `memes` (`id`, `user_id`, `filename`, `caption`, `created_at`, `likes`, `upvotes`, `category_id`) VALUES
(142, 11, 'meme_6878a14ff059f3.76151465.jpg', '😂', '2025-07-17 07:07:59', 2, 2, 3),
(145, 11, 'meme_6878a1cd1520a9.16381570.jpg', 'Mulifye nobulshi', '2025-07-17 07:10:05', 3, 3, 1),
(146, 11, 'meme_6878a4552e08c3.38387934.jpg', 'Aiini guys?', '2025-07-17 07:20:53', 2, 1, 3),
(147, 11, 'meme_6878a485c8e6b4.60114041.jpg', 'school kah-😫', '2025-07-17 07:21:41', 1, 2, 1),
(153, 11, 'meme_6878a502b21d81.89338952.jpg', 'Early riser na K2 pa poocket', '2025-07-17 07:23:46', 2, 3, 2),
(156, 12, 'meme_6878a5a81a3d67.98392218.jpg', 'Eee aaaiii', '2025-07-17 07:26:32', 1, 0, 2),
(157, 12, 'meme_6878a5d68832b2.46986059.jpg', 'Salamaleku😂', '2025-07-17 07:27:18', 1, 0, 2),
(158, 12, 'meme_6878a6011e3038.07356495.jpg', 'School life', '2025-07-17 07:28:01', 2, 0, 1),
(159, 12, 'meme_6878a6264b55d6.59497495.jpg', '😭', '2025-07-17 07:28:38', 3, 3, 3),
(160, 13, 'meme_6878a68dbb9b30.48544804.jpg', '😭🤣', '2025-07-17 07:30:21', 1, 1, 4),
(165, 13, 'meme_6878a747b7cef5.15099079.jpg', 'Confused☹', '2025-07-17 07:33:27', 3, 1, 4),
(166, 13, 'meme_6878a79557ea12.30945601.jpg', '🤣😥', '2025-07-17 07:34:45', 1, 0, 2),
(167, 11, 'meme_6878a9626b4098.62474181.jpg', 'Because the bills won\'t pay theselves😭', '2025-07-17 07:42:26', 2, 1, 1),
(169, 13, 'meme_687a1ccc7b2727.15800224.jpg', '😫🥱', '2025-07-18 10:07:08', 1, 0, 1);

-- --------------------------------------------------------

--
-- Table structure for table `reactions`
--

CREATE TABLE `reactions` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `meme_id` int(11) DEFAULT NULL,
  `reaction_type` enum('like','upvote') NOT NULL,
  `reacted_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reactions`
--

INSERT INTO `reactions` (`id`, `user_id`, `meme_id`, `reaction_type`, `reacted_at`) VALUES
(2, 13, 159, 'upvote', '2025-07-17 07:34:09'),
(3, 13, 160, 'like', '2025-07-17 07:34:53'),
(4, 13, 158, 'like', '2025-07-17 07:38:12'),
(5, 13, 159, 'like', '2025-07-17 07:38:14'),
(9, 13, 146, 'like', '2025-07-17 07:38:27'),
(10, 13, 146, 'upvote', '2025-07-17 07:38:28'),
(11, 13, 145, 'like', '2025-07-17 07:38:29'),
(14, 12, 166, 'like', '2025-07-17 07:39:01'),
(15, 12, 165, 'like', '2025-07-17 07:39:02'),
(16, 12, 159, 'upvote', '2025-07-17 07:39:08'),
(17, 12, 159, 'like', '2025-07-17 07:39:09'),
(18, 12, 153, 'like', '2025-07-17 07:39:22'),
(19, 12, 153, 'upvote', '2025-07-17 07:39:23'),
(20, 12, 145, 'upvote', '2025-07-17 07:39:27'),
(21, 12, 145, 'like', '2025-07-17 07:39:28'),
(22, 12, 146, 'like', '2025-07-17 07:39:31'),
(23, 12, 142, 'like', '2025-07-17 07:39:34'),
(24, 11, 165, 'like', '2025-07-17 07:40:17'),
(25, 11, 159, 'like', '2025-07-17 07:40:25'),
(26, 11, 158, 'like', '2025-07-17 07:40:26'),
(27, 11, 153, 'upvote', '2025-07-17 07:40:31'),
(28, 11, 159, 'upvote', '2025-07-17 07:40:36'),
(29, 11, 147, 'upvote', '2025-07-17 07:40:41'),
(30, 11, 145, 'like', '2025-07-17 07:40:43'),
(31, 11, 145, 'upvote', '2025-07-17 07:40:44'),
(32, 11, 142, 'upvote', '2025-07-17 07:40:48'),
(34, 11, 167, 'upvote', '2025-07-17 08:09:08'),
(35, 11, 167, 'like', '2025-07-17 08:11:06'),
(36, 11, 142, 'like', '2025-07-17 08:18:43'),
(37, 13, 165, 'like', '2025-07-18 08:29:45'),
(40, 13, 147, 'upvote', '2025-07-18 08:47:29'),
(42, 13, 145, 'upvote', '2025-07-18 08:48:44'),
(43, 13, 160, 'upvote', '2025-07-18 08:49:40'),
(44, 13, 147, 'like', '2025-07-18 08:50:19'),
(45, 13, 165, 'upvote', '2025-07-18 08:51:42'),
(46, 13, 156, 'like', '2025-07-18 09:00:16'),
(47, 13, 157, 'like', '2025-07-18 09:00:18'),
(48, 13, 142, 'upvote', '2025-07-18 09:00:39'),
(49, 13, 167, 'like', '2025-07-18 10:12:25'),
(50, 13, 169, 'like', '2025-07-18 10:13:09'),
(51, 13, 153, 'like', '2025-07-18 13:00:55'),
(52, 13, 153, 'upvote', '2025-07-18 13:00:57');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `created_at`) VALUES
(11, 'kapula', 'kapula@gmail.com', '$2y$10$O/wGM9pyljU9CliNXYRUCutdGYRo0zHCZ5.D4E.Ecr4VbJCYYsFuy', '2025-07-17 07:01:04'),
(12, 'Smon', 'Simon@gmail.com', '$2y$10$OzO8C4LXjfEdh/ut8sHpAuZWQcN3Zgxmx.q3DOyvzb0bOch8.GfqK', '2025-07-17 07:25:03'),
(13, 'Marvis', 'Marvis@gmail.com', '$2y$10$lo/tLWXw0rOXsFRBM67Hpuf14OFTYiPQq2hMMlZWHlrwUBb2xGx0O', '2025-07-17 07:29:20');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `memes`
--
ALTER TABLE `memes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `fk_meme_category` (`category_id`);

--
-- Indexes for table `reactions`
--
ALTER TABLE `reactions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`,`meme_id`,`reaction_type`),
  ADD UNIQUE KEY `UQ_user_meme_reaction` (`user_id`,`meme_id`,`reaction_type`),
  ADD KEY `meme_id` (`meme_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `memes`
--
ALTER TABLE `memes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=170;

--
-- AUTO_INCREMENT for table `reactions`
--
ALTER TABLE `reactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `memes`
--
ALTER TABLE `memes`
  ADD CONSTRAINT `fk_meme_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `memes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `reactions`
--
ALTER TABLE `reactions`
  ADD CONSTRAINT `reactions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reactions_ibfk_2` FOREIGN KEY (`meme_id`) REFERENCES `memes` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
