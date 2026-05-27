INSERT INTO semesters (semester, term_year) VALUES
('spring', 2024),
('fall', 2024),
('spring', 2025),
('fall', 2025),
('spring', 2026),
('fall', 2026),
('spring', 2027);

INSERT INTO app_config (current_semester_id)
    SELECT id
    FROM Semesters
    WHERE semester = 'fall'
    AND term_year = 2026;

INSERT INTO users (
    firstname, 
    lastname,
    user_type, 
    duke_email,
    is_admin
) 
VALUES 
(
    'Ra''Kira', 
    'Nelson', 
    'player', 
    'rakira.nelson@duke.edu', 
    TRUE
);
