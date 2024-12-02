package com.ozgortechnologies.demo.student;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Table("students") // PostgreSQL'deki tablo adı
public class Student {

    @Id // Primary Key
    private Integer id;

    private String firstname;

    private int number;
}