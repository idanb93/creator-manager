CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
	nickname VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

INSERT INTO users (nickname, email, password) VALUES ('Bill Gates', 'bill.gates@microsoft.com', '1111');
INSERT INTO users (nickname, email, password) VALUES ('GeoHot', 'george.hotz@comma.ai', '1234');
INSERT INTO users (nickname, email, password) VALUES ('Elon Musk', 'elon.musk@tesla.com', '1234');
INSERT INTO users (nickname, email, password) VALUES ('Mark Zuckerberg', 'mark.zuckerberg@meta.com', '1111');
INSERT INTO users (nickname, email, password) VALUES ('MalewareTech', 'marcus.hutchins@cy-researcher.com', '1234');

CREATE TABLE posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    author INT,
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    FOREIGN KEY (author) REFERENCES users(id) ON DELETE CASCADE
);

INSERT INTO posts (author, title, body) VALUES (1, "The Future of Clean Energy: Bill Gates' Vision", "Bill Gates recently shared his vision for the future of clean energy, emphasizing the critical role of innovation in combating climate change. He believes that advancements in battery technology and nuclear power are essential to achieving net-zero emissions. Gates highlighted the potential of new startups focused on sustainable energy solutions, urging both governments and private sectors to invest more heavily in research and development. As the world faces increasing environmental challenges, Gates' insights offer a hopeful perspective on how technology can drive meaningful change.");
INSERT INTO posts (author, title, body) VALUES (2, "GeoHot's Take on AI and Autonomous Vehicles", "George Hotz, renowned for his work in hacking and AI, recently shared his thoughts on the future of autonomous vehicles. Hotz believes that while self-driving technology has made significant strides, it still faces numerous challenges, particularly in terms of safety and regulation. He argues that open-source contributions and community-driven innovation could accelerate progress in this field. Hotz's perspective highlights the need for collaboration and transparency to overcome the technical and ethical hurdles that lie ahead in the development of autonomous driving technologies.");
INSERT INTO posts (author, title, body) VALUES (3, "Elon Musk's Ambitious Plans for Mars Colonization", "Elon Musk has once again captured the imagination of the tech world with his ambitious plans for Mars colonization. In a recent statement, Musk outlined SpaceX's roadmap for sending humans to Mars, focusing on advancements in rocket technology and sustainable life support systems. He envisions a future where humanity can establish a self-sustaining colony on the Red Planet, a goal he believes is achievable within the next decade. Musk's vision underscores his commitment to pushing the boundaries of space exploration and ensuring humanity's survival beyond Earth.");
INSERT INTO posts (author, title, body) VALUES (4, "Metaverse: A New Digital Frontier", "Mark Zuckerberg recently elaborated on his vision for the Metaverse, an immersive digital space where people can interact, work, and play. According to Zuckerberg, the Metaverse represents the next evolution of the internet, offering unprecedented opportunities for virtual collaboration and social interaction. He emphasized the role of augmented reality (AR) and virtual reality (VR) technologies in creating this new digital frontier. Zuckerberg's insights reflect his belief in the transformative potential of the Metaverse and its impact on how we connect and engage in the future.");
INSERT INTO posts (author, title, body) VALUES (5, 'Rise of Ransomware: Strategies for Prevention', "Marcus Hutchins, a well-known malware researcher, has recently addressed the escalating threat of ransomware attacks. Hutchins discussed the evolving tactics used by cybercriminals and emphasized the importance of proactive measures to safeguard against these threats. He advocates for regular software updates, robust backup strategies, and employee training as essential components of a comprehensive cybersecurity approach. Hutchins' expertise highlights the need for vigilance and preparedness in defending against ransomware, a growing concern for organizations and individuals alike in the digital age.");