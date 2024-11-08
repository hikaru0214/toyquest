Create Table User(
    user_id INT(5) NOT NULL AUTO_INCREMENT,
    user_name VARCHAR(30) NOT NULL,
    mailaddress VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    set_filePath VARCHAR(255),
    PRIMARY KEY (user_id)  
);

Create Table Game(
    game_id INT(4) NOT NULL AUTO_INCREMENT,
    game_name VARCHAR(120) NOT NULL,
    game_description VARCHAR(500) NOT NULL,
    PRIMARY KEY (game_id)
);

Create Table Score(
    score_id INT(8) NOT NULL AUTO_INCREMENT,
    game_id INT(4) NOT NULL,
    user_id INT(5) NOT NULL,
    registration_date DATE NOT NULL,
    score INT(6) NOT NULL,
    PRIMARY KEY (score_id),
    FOREIGN KEY (game_id) REFERENCES Game(game_id),
    FOREIGN KEY (user_id) REFERENCES User(user_id)
);

Create Table Friend(
    friend_list_id INT(6) NOT NULL AUTO_INCREMENT,
    user_id INT(5) NOT NULL,
    friend_id INT(5) NOT NULL,
    created_date DATE NOT NULL,
    PRIMARY KEY (friend_list_id),
    FOREIGN KEY (user_id) REFERENCES User(user_id),
    FOREIGN KEY (friend_id) REFERENCES User(user_id)
);

Create Table Request(
    request_id INT(6) NOT NULL AUTO_INCREMENT,
    request_user INT(5) NOT NULL,
    accept_user INT(5) NOT NULL,
    request_status BOOLEAN NOT NULL,
    request_date DATE NOT NULL,
    update_date DATE NOT NULL,
    PRIMARY KEY (request_id),
    FOREIGN KEY (request_user) REFERENCES User(user_id),
    FOREIGN KEY (accept_user) REFERENCES User(user_id)
);

INSERT INTO User (user_name, mailaddress, password, set_filePath) VALUES
('John Doe', 'john.doe@example.com', 'securepassword123', '/path/to/file1'),
('Jane Smith', 'jane.smith@example.com', 'anothersecurepassword', '/path/to/file2');

INSERT INTO Game (game_name, game_description) VALUES
('Brush Dengon', 'It is a drawing game.'),
('チャリ走', 'The game is called "チャリ走".');