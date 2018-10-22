create database top1000;

USE top1000;

CREATE TABLE songs (
 id INT NOT NULL AUTO_INCREMENT,
 artist VARCHAR(255) NULL,
 song VARCHAR(255) NULL,
 year YEAR(4) NULL,
 raw_total DECIMAL(6,3) NULL,
 raw_usa DECIMAL(6,3) NULL,
 raw_uk DECIMAL(6,3) NULL,
 raw_eur DECIMAL(6,3) NULL,
 raw_row DECIMAL(6,3) NULL,
 PRIMARY KEY (id)
);
