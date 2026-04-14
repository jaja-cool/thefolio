import React, { useState } from "react";
import { Link } from "react-router-dom";

import mamaPng from "../pages/pic/mama(1)(1).png";
import jajaJpg from "../pages/pic/jaja.jpg";

const AboutPage = () => {
  const [toggle1, setToggle1] = useState(false);
  const [toggle2, setToggle2] = useState(false);

  return (
    <>
      <main className="content1">
        {/* LEFT RECTANGLE */}
        <input
          type="checkbox"
          id="toggle1"
          checked={toggle1}
          onChange={() => {
            setToggle1(!toggle1);
            setToggle2(false);
          }}
        />
        <label htmlFor="toggle1" className="rectangle">
          <span className="before">
            What I Love About<br></br>
            <h2 className="section-title">My Mother</h2>
          </span>
          <span className="after">
            <img src={mamaPng} alt="After for left rectangle" />

            <strong>I Love About My Mother</strong>
            <hr></hr>
            <br></br>
            <p>
              What I love most about my mother is her incredible strength, her
              unwavering ability to handle everything, and her endless patience
              in every situation she faces.
            </p>
            <p>
              My mother is truly strong. No matter how difficult life gets, she
              bears the pain quietly and shows nothing but resilience. She never
              tries to show me that she's struggling; she handles everything on
              her own. There were times when she faced the hardest moments of
              her life, and I knew how much it must have hurt her, yet she never
              gave up. She endured it all, proving that even in the darkest
              times, she could survive. Her strength is not just physical or
              outward—it is the strength of the heart, a strength that inspires
              me every day.
            </p>
            <p>
              But she is not only strong; she is also incredibly resilient. My
              mother handles every challenge with grace, even in the toughest
              situations. She always puts others first, especially me, even when
              she herself needs care and support. She smooths over difficulties
              so that life feels easier for me, making sacrifices without a
              second thought, just to ensure I am comfortable and happy.
            </p>
            <p>
              What I love most about my mother is her patience. No matter how
              hard things get, she always reminds me, "Everything will pass, and
              it will all be okay." She waits for me every day after school, no
              matter how tired or busy she is, just to make sure I get home
              safely. Her patience and dedication are endless, and it is
              something I admire more than words can express.
            </p>
            <p>
              I love how my mother makes life feel lighter, even during the
              hardest times. She is always there for me—whether I need someone
              to talk to, someone to share my worries with, or someone to laugh
              at my jokes. I can always count on her, and that is a gift I
              treasure deeply.
            </p>
            <p>
              I am so proud to call her my mother. She is my rock, my guide, my
              safe place, and my everything. I love my mother more than words
              can describe, and I am endlessly grateful for her love, her
              strength, and her unwavering presence in my life.
            </p>
          </span>
        </label>

        {/* RIGHT RECTANGLE */}
        <input
          type="checkbox"
          id="toggle2"
          checked={toggle2}
          onChange={() => {
            setToggle2(!toggle2);
            setToggle1(false);
          }}
        />
        <label htmlFor="toggle2" className="rectangle1">
          <span className="before1">
            My Journey With<br></br>
            <h2 className="section-title">Academic growth</h2>
          </span>
          <span className="after1">
            <img src={jajaJpg} alt="After for right rectangle" />

            <strong>My Journey With Academic Growth</strong>
            <hr></hr>
            <br></br>

            <p>
              My journey as a student started at a very young age. I entered
              school early because I learned how to write, read, and count
              earlier than most children. When I was three years old, I started
              going to school as a daycare student. Even though my classmates
              had started earlier than me, I was still able to keep up with them
              in class.
            </p>

            <p>
              After finishing daycare, I continued my education as a
              kindergarten student. I had to take kindergarten twice because I
              was not allowed to move to Grade 1 yet. The school said that I was
              still too young to enter Grade 1, so I had to repeat the year and
              wait until I was old enough.
            </p>

            <p>
              During my elementary years from Grade 1 to Grade 6, my teachers
              often encouraged me to join math contests. Sometimes I won, and
              sometimes I did not, but those experiences helped me improve my
              skills and confidence. I was also an honor student during that
              time. In Grade 5, I tried playing volleyball, but I later realized
              that it was not really my interest.
            </p>

            <p>
              When I entered high school, my focus began to change. I became
              very close with my friends and enjoyed spending time with them
              more than studying or holding a notebook. I enjoyed my high school
              life so much that I eventually lost my status as an honor student.
              However, I was still able to receive an award for being the Best
              in Math. I also admit that during this time, I bullied some of my
              classmates, which I later realized was wrong.
            </p>

            <p>
              When I entered college, I started to change my attitude and focus
              more on my studies. However, I had already developed the habit of
              not reviewing my lessons. Instead, I often relied on my stock
              knowledge and trusted myself to answer based on what I already
              knew. Despite these challenges, I remained determined to succeed
              and continued to push myself to achieve my goals.
            </p>

            <p>
              Looking back at my academic journey, I realize that every
              experience—both successes and setbacks—has shaped me into who I am
              today. I am grateful for the lessons learned and excited for the
              future ahead.
            </p>
          </span>
        </label>
      </main>

      {/* START GAME BUTTON */}
      <div className="game-button-container">
        <Link to="/game" className="start-game-btn">
          🎮 Play Memory Game
        </Link>
      </div>

      {/* INLINED FOOTER */}
      <footer>
        <p>Contact: jkgatchalian23109703@student.dmmmsu.edu.ph | 09668113017</p>
        <p>© 2026 Jaslyn Kate Portfolio | All Rights Reserved</p>
      </footer>
    </>
  );
};

export default AboutPage;
