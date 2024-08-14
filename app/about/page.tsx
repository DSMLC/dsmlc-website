import React from 'react'
import './aboutPage.css'

const teamMembers = [
  {
    imgSrc: 'path/to/image1.jpg',
    name: 'Team Member 1',
    description: 'Short description about team member 1.'
  },
  {
    imgSrc: 'path/to/image2.jpg',
    name: 'Team Member 2',
    description: 'Short description about team member 2.'
  },
  {
    imgSrc: 'path/to/image3.jpg',
    name: 'Team Member 3',
    description: 'Short description about team member 3.'
  },
];

const page = () => {
  return (
    <div className="page-container">
      <div style={{ paddingTop: '100px' }}>
        <div></div>
        <section className='background-gray section'>
          <div className="title-journey">DSMLC's Journey</div>        
          <div>
            <p className='lower-text'>
              The Data Science and Machine Learning Club (DSMLC) 
              was founded in 2020 by a group of students who were 
              passionate about data science and machine learning. 
              The club was created to provide a platform for students 
              to learn about data science and machine learning, as 
              well as to connect with other students who share their 
              interests. Since its founding, DSMLC has grown to include 
              over 300 members and has hosted a variety of events, 
              including workshops, hackathons, and guest lectures.
            </p>
          </div>
        </section>

      <section className="section">
        <div className="title">Our Mission</div>        
        <div>
            <p className='lower-text'>
              Our vision is to create a community of students who are 
              passionate about data science and machine learning. We 
              aim to provide students with the resources and support 
              they need to learn about these topics and to connect with 
              other students who share their interests. We also strive 
              to create a welcoming and inclusive environment where all 
              students feel comfortable expressing their ideas and 
              exploring new concepts.
            </p>
        </div>
      </section>

        <section className="section">

          <div className="title">Meet the Team</div>
          <p className='lower-text'>
            Our team is made up of students from a variety of backgrounds 
            and disciplines. We are united by our passion for data science 
            and machine learning and our desire to create a vibrant and 
            inclusive community for students who share our interests. 
            Get to know our team members below!
          </p>

          <div className="team-container">
              {teamMembers.map((member, index) => (
                <div className="team-member" key={index}>
                  <img src={member.imgSrc} alt={member.name} />
                  <h3>{member.name}</h3>
                  <p>{member.description}</p>
                </div>
              ))}
            </div>

        </section>

      </div>
    </div>
  );
};

export default page