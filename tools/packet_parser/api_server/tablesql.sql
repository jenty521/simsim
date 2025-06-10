-- --------------------------------------------------------
-- 호스트:                          127.0.0.1
-- 서버 버전:                        11.7.2-MariaDB - mariadb.org binary distribution
-- 서버 OS:                        Win64
-- HeidiSQL 버전:                  12.8.0.6908
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- api_search 데이터베이스 구조 내보내기
CREATE DATABASE IF NOT EXISTS `api_search` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */;
USE `api_search`;

-- 테이블 api_search.api_docs 구조 내보내기
CREATE TABLE IF NOT EXISTS `api_docs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL COMMENT 'API 함수명',
  `description` text NOT NULL COMMENT 'API 설명',
  `example` text NOT NULL COMMENT '사용 예제',
  `category` varchar(50) NOT NULL DEFAULT 'JavaScript' COMMENT '카테고리',
  `keywords` text DEFAULT NULL COMMENT '검색 키워드 (콤마 구분)',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_name` (`name`),
  KEY `idx_category` (`category`),
  FULLTEXT KEY `name` (`name`,`description`,`keywords`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 테이블 데이터 api_search.api_docs:~10 rows (대략적) 내보내기
INSERT INTO `api_docs` (`id`, `name`, `description`, `example`, `category`, `keywords`, `created_at`, `updated_at`) VALUES
	(1, 'alert', '브라우저 경고창을 표시합니다', 'alert(\'경고메시지\')', 'JavaScript', '경고,알림,팝업,경고창,alert', '2025-05-29 08:07:52', '2025-05-29 08:07:52'),
	(2, 'console.log', '콘솔에 로그를 출력합니다', 'console.log(\'출력내용\')', 'JavaScript', '콘솔,로그,출력,디버그,console', '2025-05-29 08:07:52', '2025-05-29 08:07:52'),
	(3, 'confirm', '확인/취소 대화상자를 표시합니다', 'confirm(\'확인하시겠습니까?\')', 'JavaScript', '확인,취소,대화상자,confirm', '2025-05-29 08:07:52', '2025-05-29 08:07:52'),
	(4, 'prompt', '사용자 입력을 받는 대화상자를 표시합니다', 'prompt(\'이름을 입력하세요\')', 'JavaScript', '입력,대화상자,prompt,사용자입력', '2025-05-29 08:07:52', '2025-05-29 08:07:52'),
	(5, 'document.getElementById', 'ID로 HTML 요소를 선택합니다', 'document.getElementById(\'myId\')', 'JavaScript', '선택,요소,ID,getElementById,DOM', '2025-05-29 08:07:52', '2025-05-29 08:07:52'),
	(6, 'addEventListener', '이벤트 리스너를 추가합니다', 'element.addEventListener(\'click\', function(){})', 'JavaScript', '이벤트,클릭,리스너,addEventListener', '2025-05-29 08:07:52', '2025-05-29 08:07:52'),
	(7, 'setTimeout', '지정된 시간 후에 함수를 실행합니다', 'setTimeout(function(){console.log(\'실행\')}, 1000)', 'JavaScript', '타이머,지연,setTimeout,시간', '2025-05-29 08:07:52', '2025-05-29 08:07:52'),
	(8, 'fetch', 'HTTP 요청을 보냅니다 (AJAX)', 'fetch(\'https://api.example.com\').then(response => response.json())', 'JavaScript', 'ajax,http,요청,fetch,api', '2025-05-29 08:07:52', '2025-05-29 08:07:52'),
	(9, 'JSON.parse', 'JSON 문자열을 객체로 변환합니다', 'JSON.parse(\'{"name":"value"}\')', 'JavaScript', 'json,파싱,변환,parse', '2025-05-29 08:07:52', '2025-05-29 08:07:52'),
	(10, 'JSON.stringify', '객체를 JSON 문자열로 변환합니다', 'JSON.stringify({name: "value"})', 'JavaScript', 'json,문자열,변환,stringify', '2025-05-29 08:07:52', '2025-05-29 08:07:52'),
	(11, 'debug', '디버그', 'debug(\'디버그내용\');', 'JavaScript', '디버그,debug', '2025-05-29 09:53:45', '2025-05-29 09:53:45');

-- 테이블 api_search.packet_fields 구조 내보내기
CREATE TABLE IF NOT EXISTS `packet_fields` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `template_id` int(11) NOT NULL,
  `field_name` varchar(50) NOT NULL,
  `byte_size` int(11) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `template_id` (`template_id`),
  CONSTRAINT `packet_fields_ibfk_1` FOREIGN KEY (`template_id`) REFERENCES `packet_templates` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 테이블 데이터 api_search.packet_fields:~14 rows (대략적) 내보내기
INSERT INTO `packet_fields` (`id`, `template_id`, `field_name`, `byte_size`, `description`) VALUES
	(1, 1, '가', 2, ''),
	(2, 1, '나', 2, ''),
	(3, 1, '다', 3, ''),
	(4, 1, '라', 4, ''),
	(5, 1, '마', 3, ''),
	(6, 1, '바', 6, ''),
	(7, 1, '시', 4, ''),
	(8, 1, 'ㄴ', 2, ''),
	(9, 1, 'ㅁ', 3, ''),
	(10, 1, 'ㅊ', 13, ''),
	(11, 2, '헤더', 5, ''),
	(12, 2, '봉문', 7, ''),
	(13, 2, '푸터', 5, ''),
	(14, 2, '공통', 12, '');

-- 테이블 api_search.packet_templates 구조 내보내기
CREATE TABLE IF NOT EXISTS `packet_templates` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `title` (`title`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 테이블 데이터 api_search.packet_templates:~2 rows (대략적) 내보내기
INSERT INTO `packet_templates` (`id`, `title`, `created_at`) VALUES
	(1, '가나다', '2025-06-10 07:56:42'),
	(2, '레더', '2025-06-10 07:57:19');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
