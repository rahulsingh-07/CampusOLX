package com.example.olx.backend.review;

import com.example.olx.backend.exception.UserNotFoundException;
import com.example.olx.backend.user.UserModel;
import com.example.olx.backend.user.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@AllArgsConstructor
public class ReviewController {

    private final ReviewRepository repository;
    private final UserRepository userRepository;

    @GetMapping("/public/reviews")
    public Page<ReviewDTO> allReview(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "5") int size) {
        Pageable pageable= PageRequest.of(page,size);
        return repository.findAll(pageable).map(review->new ReviewDTO(
                review.getComment(),
                review.getRating(),
                review.getUser().getUsername()
        ));
    }

    // Review DTO
    public record ReviewDTO(String comment, int rating, String username) {
        public static ReviewDTO from(ReviewModel model) {
            return new ReviewDTO(model.getComment(), model.getRating(), model.getUser().getUsername());
        }
    }

    @PostMapping("/review")
    public ResponseEntity<Map<String,String>> addReview(@AuthenticationPrincipal UserDetails userDetails, @RequestBody ReviewModel review){
        String username=userDetails.getUsername();
        UserModel user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        ReviewModel saveReview=new ReviewModel();
        saveReview.setRating(review.getRating());
        saveReview.setComment(review.getComment());
        saveReview.setUser(user);
        repository.save(saveReview);

        return ResponseEntity.ok(Map.of("message","successfully added review"));
    }
}
