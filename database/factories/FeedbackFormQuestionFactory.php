<?php

namespace Database\Factories;

use App\Models\FeedbackFormQuestion;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class FeedbackFormQuestionFactory extends Factory
{
    protected $model = FeedbackFormQuestion::class;

    // Array mapping questions to their descriptions and answers
    private $questionDescriptionAndAnswers = [
        'What is your experience with software development?' => [
            'description' => 'Describe your software development projects and the technologies you used.',
            'answers' => [
                'I have worked on multiple software projects using various technologies.',
                'I specialize in full-stack development, including front-end and back-end technologies.',
                'I have experience with Agile methodologies and team collaboration.',
            ],
        ],
        'Can you describe a challenging data analysis project you completed?' => [
            'description' => 'Explain the methodologies and tools you used in your data analysis.',
            'answers' => [
                'I analyzed large datasets to uncover insights that drove business decisions.',
                'I used Python and SQL to extract, transform, and visualize data.',
                'I collaborated with stakeholders to understand their needs and provided actionable insights.',
            ],
        ],
        'How do you prioritize tasks in product management?' => [
            'description' => 'Discuss your approach to managing and prioritizing product backlogs.',
            'answers' => [
                'I use the MoSCoW method to prioritize tasks based on their importance.',
                'I regularly communicate with stakeholders to adjust priorities as needed.',
                'I employ Agile practices to ensure timely delivery of high-priority tasks.',
            ],
        ],
        'What design tools do you prefer for UX design?' => [
            'description' => 'List the tools you use for designing user interfaces and experiences.',
            'answers' => [
                'I primarily use Figma and Adobe XD for creating prototypes.',
                'I find Sketch to be very useful for designing web interfaces.',
                'InVision is my go-to for collaborative design feedback.',
            ],
        ],
        'Describe your experience with digital marketing strategies.' => [
            'description' => 'Share specific campaigns you’ve worked on and their outcomes.',
            'answers' => [
                'I executed a social media campaign that increased engagement by 30%.',
                'I used SEO strategies to improve website traffic by 50%.',
                'I developed email marketing strategies that resulted in a 25% conversion rate.',
            ],
        ],
        'How do you manage customer relationships in sales?' => [
            'description' => 'Explain your strategies for maintaining client satisfaction and loyalty.',
            'answers' => [
                'I prioritize regular follow-ups and personalized communication.',
                'I utilize CRM tools to track customer interactions and feedback.',
                'I ensure timely responses to client inquiries and issues.',
            ],
        ],
        'What automation tools are you familiar with in DevOps?' => [
            'description' => 'Discuss the tools you’ve implemented in your DevOps processes.',
            'answers' => [
                'I use Jenkins for continuous integration and deployment.',
                'Docker has been invaluable for containerization in our projects.',
                'I leverage Ansible for configuration management and automation.',
            ],
        ],
        'How do you manage project timelines effectively?' => [
            'description' => 'Describe your methods for ensuring projects are delivered on time.',
            'answers' => [
                'I break down projects into manageable tasks and set clear deadlines.',
                'I utilize project management tools like Trello and Asana to track progress.',
                'Regular team check-ins help me monitor timelines and adjust as needed.',
            ],
        ],
        'What IT systems have you worked with in the past?' => [
            'description' => 'List the IT systems and software you have experience with.',
            'answers' => [
                'I have experience with ERP systems like SAP and Oracle.',
                'I have worked with various CRM platforms, including Salesforce and HubSpot.',
                'My background includes working with database systems like MySQL and MongoDB.',
            ],
        ],
        'Can you explain your web development process?' => [
            'description' => 'Outline the steps you take from concept to deployment in web development.',
            'answers' => [
                'I start with gathering requirements and creating wireframes.',
                'Next, I develop the front-end and back-end components iteratively.',
                'Finally, I test the FeedbackForm thoroughly before deployment.',
            ],
        ],
        'What methodologies do you use in software development?' => [
            'description' => 'Discuss the methodologies that you find most effective.',
            'answers' => [
                'I primarily use Agile methodologies for iterative development.',
                'Scrum is particularly effective for team collaboration and accountability.',
                'I have experience with Waterfall, but I prefer Agile for its flexibility.',
            ],
        ],
        'How do you approach team collaboration on projects?' => [
            'description' => 'Explain your strategies for effective team collaboration.',
            'answers' => [
                'I encourage open communication and regular team meetings.',
                'Using collaborative tools like Slack and Microsoft Teams enhances our workflow.',
                'I prioritize setting clear roles and responsibilities for each team member.',
            ],
        ],
        'What challenges have you faced in your previous roles?' => [
            'description' => 'Describe a significant challenge and how you overcame it.',
            'answers' => [
                'I once faced a tight deadline and managed it by reallocating resources.',
                'A major client issue arose, which I addressed by implementing a quick resolution plan.',
                'I learned to navigate team conflicts by fostering open discussions.',
            ],
        ],
        'How do you stay updated with industry trends?' => [
            'description' => 'Discuss your strategies for continuous learning and development.',
            'answers' => [
                'I regularly read industry blogs and follow influential thought leaders.',
                'Attending workshops and conferences is a key part of my learning process.',
                'I am part of professional networks and online communities for knowledge sharing.',
            ],
        ],
        'What programming languages are you proficient in?' => [
            'description' => 'List the languages you have experience with and your level of expertise.',
            'answers' => [
                'I am proficient in JavaScript, Python, and Java.',
                'I have experience with PHP and Ruby on Rails for web development.',
                'I am currently learning TypeScript to enhance my skills.',
            ],
        ],
        'Can you explain your testing process?' => [
            'description' => 'Outline the steps you take to ensure software quality.',
            'answers' => [
                'I start with unit tests followed by integration tests to validate functionality.',
                'User acceptance testing is crucial before deploying to production.',
                'I utilize automated testing frameworks to streamline the process.',
            ],
        ],
        'What is your experience with cloud technologies?' => [
            'description' => 'Discuss the cloud platforms you have worked with.',
            'answers' => [
                'I have experience with AWS and Google Cloud for hosting FeedbackForms.',
                'I use Azure for deploying machine learning models and data analytics.',
                'Cloud services have been instrumental in scaling our projects.',
            ],
        ],
        'How do you handle feedback from peers or clients?' => [
            'description' => 'Explain your approach to receiving and implementing feedback.',
            'answers' => [
                'I view feedback as a valuable tool for personal and professional growth.',
                'I actively seek feedback during and after projects for continuous improvement.',
                'I implement feedback by discussing it openly with my team to find solutions.',
            ],
        ],
        'What is your approach to data security?' => [
            'description' => 'Discuss your strategies for ensuring data security in projects.',
            'answers' => [
                'I prioritize encryption and secure access controls for sensitive data.',
                'Regular security audits are essential to identify potential vulnerabilities.',
                'I stay informed about the latest security practices and compliance requirements.',
            ],
        ],
        'Can you describe your experience with mobile app development?' => [
            'description' => 'Explain the platforms and technologies you have worked with.',
            'answers' => [
                'I have developed mobile FeedbackForms using React Native and Flutter.',
                'My experience includes both iOS and Android platforms.',
                'I focus on creating user-friendly interfaces and smooth performance.',
            ],
        ],
        'How do you manage remote teams effectively?' => [
            'description' => 'Discuss your strategies for leading remote teams.',
            'answers' => [
                'I emphasize clear communication and set expectations from the start.',
                'Utilizing project management tools keeps everyone aligned on goals.',
                'I schedule regular check-ins to maintain team morale and collaboration.',
            ],
        ],
        'What experience do you have with APIs?' => [
            'description' => 'Explain your knowledge and experience in working with APIs.',
            'answers' => [
                'I have developed RESTful APIs for various FeedbackForms.',
                'I utilize third-party APIs for enhancing FeedbackForm functionalities.',
                'API documentation is essential for ensuring smooth integration with other systems.',
            ],
        ],
        'Can you discuss your experience with Agile project management?' => [
            'description' => 'Outline your knowledge of Agile methodologies.',
            'answers' => [
                'I have worked as a Scrum Master and facilitated daily stand-ups.',
                'Sprint planning and retrospectives are crucial for project success.',
                'I encourage team collaboration and adaptability throughout the project lifecycle.',
            ],
        ],
        'How do you approach user research?' => [
            'description' => 'Discuss your methods for conducting user research.',
            'answers' => [
                'I utilize surveys and interviews to gather user feedback.',
                'Usability testing helps me understand user behavior and preferences.',
                'I analyze data from user interactions to inform design decisions.',
            ],
        ],
        'What experience do you have with version control systems?' => [
            'description' => 'Explain your knowledge of Git and other version control systems.',
            'answers' => [
                'I use Git for version control in all my development projects.',
                'Collaborating with teams on GitHub has streamlined our workflow.',
                'I conduct regular code reviews to maintain code quality and consistency.',
            ],
        ],
        'Can you describe a successful project you managed?' => [
            'description' => 'Outline the goals, challenges, and outcomes of the project.',
            'answers' => [
                'I led a project that increased revenue by 40% through improved UX.',
                'The project faced tight deadlines, which I managed effectively.',
                'Regular stakeholder communication was key to the project’s success.',
            ],
        ],
        'How do you approach onboarding new team members?' => [
            'description' => 'Discuss your strategies for effective onboarding.',
            'answers' => [
                'I create a structured onboarding plan with clear objectives.',
                'Mentorship programs help new hires acclimate quickly.',
                'I prioritize cultural integration alongside skills training.',
            ],
        ],
        'What is your experience with data visualization tools?' => [
            'description' => 'Explain the tools you have used for data visualization.',
            'answers' => [
                'I utilize Tableau and Power BI for creating interactive dashboards.',
                'Data storytelling is crucial for conveying insights effectively.',
                'I have experience with D3.js for custom visualizations in web FeedbackForms.',
            ],
        ],
        'How do you handle project scope changes?' => [
            'description' => 'Discuss your approach to managing scope changes in projects.',
            'answers' => [
                'I communicate changes to stakeholders and assess impacts on timelines.',
                'I document scope changes and adjust project plans accordingly.',
                'Flexibility and adaptability are key in managing project scope.',
            ],
        ],
        'Can you explain your experience with mentorship?' => [
            'description' => 'Discuss your role in mentoring others in your field.',
            'answers' => [
                'I have mentored junior developers and interns, helping them grow.',
                'I believe in providing constructive feedback and guidance.',
                'Regular one-on-one sessions help foster a productive mentor-mentee relationship.',
            ],
        ],
        'What tools do you use for project management?' => [
            'description' => 'List the project management tools you are familiar with.',
            'answers' => [
                'I use Trello and Asana for task management and tracking.',
                'Jira is essential for managing Agile projects effectively.',
                'Slack helps facilitate communication and collaboration within teams.',
            ],
        ],
        'How do you assess project risks?' => [
            'description' => 'Discuss your methods for identifying and managing risks.',
            'answers' => [
                'I conduct risk assessments at the start of each project.',
                'Regularly reviewing project status helps identify potential risks early.',
                'I maintain a risk register to track and manage risks throughout the project.',
            ],
        ],
        'Can you explain your experience with performance optimization?' => [
            'description' => 'Discuss your strategies for optimizing FeedbackForm performance.',
            'answers' => [
                'I use profiling tools to identify performance bottlenecks in code.',
                'Implementing caching strategies significantly improves load times.',
                'Regular code reviews help maintain code quality and performance.',
            ],
        ],
        'What is your experience with mobile-responsive design?' => [
            'description' => 'Discuss your approach to creating mobile-friendly FeedbackForms.',
            'answers' => [
                'I use responsive frameworks like Bootstrap for quick development.',
                'Testing across various devices ensures consistent user experience.',
                'I focus on optimizing images and assets for mobile performance.',
            ],
        ],
        'How do you ensure cross-browser compatibility?' => [
            'description' => 'Discuss your strategies for testing and ensuring compatibility.',
            'answers' => [
                'I use tools like BrowserStack to test FeedbackForms across different browsers.',
                'Adhering to web standards helps minimize compatibility issues.',
                'Regular testing during development ensures early detection of issues.',
            ],
        ],
        'What is your approach to continuous improvement?' => [
            'description' => 'Discuss your strategies for fostering a culture of continuous improvement.',
            'answers' => [
                'I encourage team members to share feedback and ideas for improvement.',
                'Regular retrospectives help us identify areas for growth.',
                'I prioritize training and professional development opportunities.',
            ],
        ],
        'Can you explain your experience with SEO?' => [
            'description' => 'Discuss your strategies for optimizing websites for search engines.',
            'answers' => [
                'I conduct keyword research to guide content development.',
                'I optimize site structure and metadata for better indexing.',
                'Regularly analyzing performance metrics helps refine our SEO strategies.',
            ],
        ],
        'How do you approach client presentations?' => [
            'description' => 'Discuss your strategies for delivering effective presentations.',
            'answers' => [
                'I tailor presentations to the audience’s needs and expectations.',
                'Visual aids and data storytelling enhance engagement.',
                'Practicing beforehand helps me deliver confidently.',
            ],
        ],
        'What is your experience with user onboarding?' => [
            'description' => 'Discuss your approach to onboarding users to FeedbackForms.',
            'answers' => [
                'I create intuitive onboarding flows to guide users effectively.',
                'Utilizing tooltips and tutorials enhances user understanding.',
                'I gather feedback during onboarding to refine the experience.',
            ],
        ],
        'How do you ensure accessibility in your designs?' => [
            'description' => 'Discuss your strategies for creating accessible FeedbackForms.',
            'answers' => [
                'I follow WCAG guidelines to ensure compliance.',
                'Incorporating user feedback helps improve accessibility.',
                'Regular testing with assistive technologies is essential.',
            ],
        ],
        'Can you describe your experience with e-commerce platforms?' => [
            'description' => 'Discuss the platforms you have worked with and your role.',
            'answers' => [
                'I have worked with Shopify and WooCommerce for online stores.',
                'I focus on optimizing user experience for increased conversions.',
                'Integrating payment gateways has been a significant part of my role.',
            ],
        ],
        'How do you handle conflicts in a team setting?' => [
            'description' => 'Discuss your approach to resolving team conflicts.',
            'answers' => [
                'I prioritize open communication and understanding different perspectives.',
                'I facilitate discussions to find common ground and solutions.',
                'I encourage a collaborative approach to resolving conflicts.',
            ],
        ],
        'What is your experience with data migration?' => [
            'description' => 'Discuss the processes you follow for data migration projects.',
            'answers' => [
                'I conduct thorough planning and validation before migration.',
                'Testing the migration process in a staging environment is crucial.',
                'Post-migration checks ensure data integrity and accuracy.',
            ],
        ],
        'How do you assess user feedback?' => [
            'description' => 'Discuss your methods for analyzing and acting on user feedback.',
            'answers' => [
                'I categorize feedback to identify common themes and issues.',
                'Regularly reviewing feedback helps inform product improvements.',
                'I prioritize actionable feedback that aligns with our goals.',
            ],
        ],
        'Can you explain your experience with localization?' => [
            'description' => 'Discuss your strategies for localizing FeedbackForms for different markets.',
            'answers' => [
                'I ensure cultural relevance by researching local customs and preferences.',
                'Using localization tools streamlines the translation process.',
                'I involve native speakers for quality assurance in translations.',
            ],
        ],
    ];



    public function definition()
    {
        // Randomly select a question and its corresponding description and answers
        $question = $this->faker->randomElement(array_keys($this->questionDescriptionAndAnswers));
        $description = $this->questionDescriptionAndAnswers[$question]['description'];
        $answers = $this->questionDescriptionAndAnswers[$question]['answers'];

        // Randomly decide if 'data' will be text or an options array
        $dataType = $this->faker->randomElement(['text','select', 'radio', 'checkbox','textarea' ]);

        if ($dataType != 'text' && $dataType != 'textarea') {
            // Create options based on the answers for the question
            $options = [
                'options' => array_map(function ($answer) {
                    return [
                        'uuid' => (string) Str::uuid(),
                        'text' => $answer,
                    ];
                }, $answers),
            ];
            $data = json_encode($options); // Encode the array as a JSON string
        } else {
            $data = $this->faker->text; // Simple text (if needed for some questions)
        }

        return [
            'type' => $dataType, // Keep this if you have different types
            'question' => $question, // Random job question
            'description' => $description, // Corresponding job description
            'data' => $data,
            'feedbackform_id' => null, // Set later
        ];
    }
}
