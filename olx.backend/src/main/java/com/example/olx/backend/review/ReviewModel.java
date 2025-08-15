package com.example.olx.backend.review;

import com.example.olx.backend.user.UserModel;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReviewModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // auto-increment id
    private Long id;
    @Column(nullable = false)
    private int rating;
    @Column(nullable = false)
    private String comment;
    @ManyToOne
    @JoinColumn(name = "userid")
    private UserModel user;
}
