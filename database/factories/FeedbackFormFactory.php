<?php

namespace Database\Factories;

use App\Models\FeedbackForm;
use App\Models\FeedbackFormQuestion;
use App\Models\FeedbackFormAnswer;
use App\Models\FeedbackFormQuestionAnswer;

use Illuminate\Database\Eloquent\Factories\Factory;

class FeedbackFormFactory extends Factory
{
    protected $model = FeedbackForm::class;

    // Array of tech company titles and descriptions
    protected $techCompanies = [
        [
            'title' => 'Amazon Web Services (AWS)',
            'description' => 'Amazon Web Services (AWS) is the leading cloud platform, offering over 200 fully featured services from data centers around the globe. AWS provides a vast array of cloud computing solutions, including computing power, storage options, and networking capabilities. Its extensive suite of tools enables organizations to run FeedbackForms and services at scale, providing businesses with flexibility and agility. AWS has revolutionized the way companies approach IT infrastructure, allowing them to innovate faster while managing costs effectively. With services like Amazon EC2 for computing, Amazon S3 for storage, and Amazon RDS for database management, AWS supports startups to large enterprises in deploying FeedbackForms seamlessly. The platform is known for its reliability, security, and comprehensive compliance capabilities, ensuring that data is protected and accessible only to authorized users. Furthermore, AWS continuously expands its offerings to meet the evolving needs of customers, making it a pivotal player in the cloud computing industry.',
            'image' => 'https://logohistory.net/wp-content/uploads/2023/06/AWS-Emblem.png',
        ],
        [
            'title' => 'GitHub',
            'description' => 'GitHub is a powerful platform for version control and collaboration, primarily used by developers to manage and share code. It allows users to track changes in their codebase, collaborate on projects, and contribute to open-source initiatives. With features like pull requests, issue tracking, and code review, GitHub streamlines the development workflow, enabling teams to work together more efficiently, regardless of their physical location. It also serves as a social networking site for programmers, where developers can showcase their projects, follow others, and contribute to community-driven software. GitHub is widely recognized for its role in the open-source movement, hosting millions of repositories and providing a space for developers to collaborate on innovative solutions. Additionally, GitHub integrates with various tools and services, enhancing its capabilities and enabling continuous integration and deployment, making it a central hub in modern software development.',
            'image' => 'https://logos-world.net/wp-content/uploads/2020/11/GitHub-Logo.png',
        ],
        [
            'title' => 'Google',
            'description' => 'Google is a multinational technology giant that specializes in Internet-related services and products, including search engines, online advertising technologies, cloud computing, software, and hardware. Founded in 1998, Google has grown to dominate the search engine market, processing billions of searches daily. Its flagship product, the Google Search engine, is known for its innovative algorithms that deliver relevant results quickly and efficiently. Beyond search, Google offers a plethora of services such as Google Ads, Google Cloud, and Google Workspace, empowering businesses and individuals with tools for productivity and collaboration. The company invests heavily in research and development, driving advancements in artificial intelligence, machine learning, and autonomous technology. Through initiatives like Google AI and Waymo, Google continues to shape the future of technology, aiming to organize the worlds information and make it universally accessible and useful.',
            'image' => 'http://pluspng.com/img-png/google-logo-png-google-logo-icon-png-transparent-background-1000.png',
        ],
        [
            'title' => 'Microsoft',
            'description' => 'Microsoft is a global leader in software, hardware, and technology solutions. Established in 1975, it has evolved into a diversified technology company, best known for its software products like the Windows operating system and Microsoft Office suite. In recent years, Microsoft has embraced cloud computing through its Azure platform, offering a range of cloud services that allow businesses to build, deploy, and manage FeedbackForms through Microsoft-managed data centers. With a strong focus on innovation, Microsoft has expanded its portfolio to include gaming through Xbox, productivity tools via Microsoft 365, and enterprise solutions that help organizations streamline operations. Microsoft’s commitment to artificial intelligence, cybersecurity, and sustainability further reinforces its position as a technology leader. The company prioritizes user experience and accessibility, ensuring that its products cater to a diverse range of users across various industries.',
            'image' => 'https://tse2.mm.bing.net/th?id=OIP.Amtad6cu5WsYrZ3gC2IgGgHaFj&pid=Api&P=0&h=180',
        ],
        [
            'title' => 'Apple',
            'description' => 'Apple Inc. is a renowned technology company that designs, manufactures, and markets consumer electronics, software, and services. Founded in 1976, Apple revolutionized personal computing with its innovative Macintosh computers. Today, it is best known for its flagship products, including the iPhone, iPad, and Mac computers, which have set industry standards in design and functionality. Apple’s commitment to quality and user experience is reflected in its ecosystem of products and services, such as iCloud, Apple Music, and the App Store, which seamlessly integrate with its hardware offerings. The company places a strong emphasis on privacy and security, continuously updating its products to protect user data. Apple’s influence extends beyond technology, as it fosters creativity and innovation in various fields, including music, film, and education, positioning itself as a leader in the tech industry.',
            'image' => 'https://tse3.mm.bing.net/th?id=OIP.tJwzYFnd3ueF1zEY0GB2sAHaBz&pid=Api&P=0&h=180',
        ],
        [
            'title' => 'Facebook (Meta)',
            'description' => 'Meta Platforms, Inc., formerly known as Facebook, is a technology conglomerate that focuses on building social media services and products. Founded in 2004, Meta has transformed the way people connect and communicate, with its flagship platform, Facebook, enabling users to share content and interact with friends and family worldwide. The company has expanded its offerings to include Instagram, WhatsApp, and Oculus, catering to a diverse range of social and virtual reality experiences. Meta invests heavily in research and development to create innovative solutions that foster community engagement and support businesses through advertising and marketing tools. As the company shifts its focus toward the metaverse, it aims to create immersive virtual environments that redefine social interaction. Metas commitment to connecting people through technology positions it as a key player in shaping the future of communication and online interaction.',
            'image' => 'https://tse4.mm.bing.net/th?id=OIP.8X_lapTX1VwsdFdHfZikXgHaFj&pid=Api&P=0&h=180',
        ],
        [
            'title' => 'IBM',
            'description' => 'IBM, or International Business Machines Corporation, is an American multinational technology company known for its hardware, software, and cloud-based services. Founded in 1911, IBM has been a pioneer in computing technology and continues to be at the forefront of innovation. The company specializes in cognitive computing, artificial intelligence, and data analytics, with its IBM Watson platform leading the way in AI-driven solutions. IBM also provides a range of enterprise services, including cloud computing, cybersecurity, and consulting, helping organizations to leverage technology for improved business outcomes. With a commitment to research and development, IBM invests billions annually to drive advancements in quantum computing and blockchain technology. The company’s focus on ethics and responsible AI further enhances its reputation as a leader in the tech industry.',
            'image' => 'https://tse3.mm.bing.net/th?id=OIP.kNWAt-y7c0XIIry-_jq6ZwHaHa&pid=Api&P=0&h=180',
        ],
        [
            'title' => 'Tesla',
            'description' => 'Tesla, Inc. is an American electric vehicle and clean energy company that has revolutionized the automotive industry with its innovative electric cars. Founded in 2003, Tesla has gained worldwide recognition for its commitment to sustainability and cutting-edge technology. The company’s lineup includes the Model S, Model 3, Model X, and Model Y, all designed to deliver high performance while minimizing environmental impact. Tesla not only focuses on vehicle production but also emphasizes energy solutions, including solar energy products and battery storage systems. Through its Gigafactories, Tesla aims to scale production and reduce costs, making electric vehicles accessible to a broader audience. The company’s visionary leader, Elon Musk, has positioned Tesla at the forefront of the clean energy movement, driving advancements in battery technology and autonomous driving capabilities.',
            'image' => 'https://tse1.mm.bing.net/th?id=OIP.9N0sjeFMOOkcfuOwzldzLwHaHa&pid=Api&P=0&h=180',
        ],
        [
            'title' => 'Salesforce',
            'description' => 'Salesforce is a global leader in cloud-based software solutions, particularly known for its customer relationship management (CRM) platform. Founded in 1999, Salesforce has transformed the way companies manage their customer interactions, sales, and marketing efforts. With a focus on cloud computing, Salesforce provides businesses with the tools needed to connect with customers and streamline operations. Its suite of FeedbackForms, including Sales Cloud, Service Cloud, and Marketing Cloud, enables organizations to personalize customer experiences and optimize workflows. Salesforce is committed to innovation, continuously enhancing its platform with new features and integrations. The company also emphasizes corporate social responsibility, advocating for equality, sustainability, and philanthropy through its 1-1-1 model, which dedicates resources to community causes.',
            'image' => 'https://tse2.mm.bing.net/th?id=OIP.C4fKsJadhinUb8drZnaucAHaEo&pid=Api&P=0&h=180',
        ],
        [
            'title' => 'Spotify',
            'description' => 'Spotify is a leading digital music streaming service that provides users access to millions of songs and podcasts from around the world. Founded in 2006, Spotify has transformed how people listen to music, offering personalized playlists, curated recommendations, and the ability to share music with friends. The platform’s user-friendly interface and advanced algorithms allow users to discover new artists and genres tailored to their preferences. Spotify also supports artists and creators through various initiatives, including Spotify for Artists, which provides insights into listener data and tools to promote their work. With a strong focus on innovation, Spotify continually expands its offerings, including exclusive podcasts and live audio experiences, positioning itself as a major player in the entertainment industry and a key driver of the music streaming revolution.',
            'image' => 'https://tse4.mm.bing.net/th?id=OIP.3c5xTRnB9dbXuJYsJUSf4gHaCm&pid=Api&P=0&h=180',
        ],
    ];
    

    public function definition()
    {
        // Randomly select a tech company
        $company = $this->faker->randomElement($this->techCompanies);

        return [
            'title' => $company['title'],
            'description' => $company['description'],
            'expire_date' => $this->faker->dateTimeBetween('+1 week', '+1 month'),
            'image' => $company['image'], // Use the corresponding image
            'user_id' => \App\Models\User::factory(), // Assuming you have a User factory
            'status' => $this->faker->randomElement(['active', 'inactive']),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }

    public function configure()
    {
        return $this->afterCreating(function (FeedbackForm $FeedbackForm) {
            // Create associated FeedbackFormQuestions
            FeedbackFormQuestion::factory()
                ->count(3) // Change count as needed
                ->create(['feedbackform_id' => $FeedbackForm->id])
                ->each(function ($question) use ($FeedbackForm) {
                    // Create associated FeedbackFormAnswers for each question
                    $answer = FeedbackFormAnswer::factory()
                        ->create(['feedbackform_id' => $FeedbackForm->id]);
    
                    // Now create FeedbackFormQuestionAnswer
                    FeedbackFormQuestionAnswer::factory()
                        ->create([
                            'feedbackform_question_id' => $question->id,
                            'feedbackform_answer_id' => $answer->id,
                            'answer' => $this->faker->sentence, // Optionally add an answer
                        ]);
                });
        });
    }

}
