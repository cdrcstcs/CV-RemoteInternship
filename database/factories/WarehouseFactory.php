<?php
namespace Database\Factories;

use App\Models\Warehouse;
use App\Models\User; // Import the User model to associate a user with the warehouse
use Illuminate\Database\Eloquent\Factories\Factory;

class WarehouseFactory extends Factory
{
    protected $model = Warehouse::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Predefined list of real warehouse names (can be expanded as needed)
        $warehouseNames = [
            'Amazon Fulfillment Center', 'Walmart Distribution Center', 'FedEx Warehouse',
            'UPS Supply Chain Solutions', 'Home Depot Distribution Hub', 'Target Warehouse',
            'Costco Distribution Center', 'Kroger Supply Chain', 'Best Buy Warehouse', 'Lidl Logistics Hub'
        ];

        // Predefined list of real cities, states, and country codes (ISO3)
        $countriesISO3 = [
            'USA' => 'United States', 'CAN' => 'Canada', 'GBR' => 'United Kingdom', 
            'DEU' => 'Germany', 'FRA' => 'France', 'AUS' => 'Australia', 'IND' => 'India',
            'BRA' => 'Brazil', 'CHN' => 'China', 'JPN' => 'Japan', 'MEX' => 'Mexico',
            'ITA' => 'Italy', 'ESP' => 'Spain', 'RUS' => 'Russia', 'ZAF' => 'South Africa',
            'ARG' => 'Argentina', 'KOR' => 'South Korea', 'SAU' => 'Saudi Arabia',
            'SWE' => 'Sweden', 'NLD' => 'Netherlands', 'BEL' => 'Belgium', 'CHE' => 'Switzerland',
            'DNK' => 'Denmark', 'NOR' => 'Norway', 'FIN' => 'Finland', 'POL' => 'Poland',
            'TUR' => 'Turkey', 'EGY' => 'Egypt', 'ARE' => 'United Arab Emirates', 'GRC' => 'Greece',
            'SGP' => 'Singapore', 'CHL' => 'Chile', 'PER' => 'Peru', 'KSA' => 'Saudi Arabia',
            'IDN' => 'Indonesia', 'PHL' => 'Philippines', 'MYS' => 'Malaysia', 'NZL' => 'New Zealand'
        ];
        
        $cities = [
            'USA' => ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'San Francisco', 'Boston', 'Dallas', 'Seattle', 'Miami'],
            'CAN' => ['Toronto', 'Vancouver', 'Montreal', 'Ottawa', 'Calgary', 'Edmonton', 'Quebec City', 'Winnipeg', 'Hamilton', 'Kitchener'],
            'GBR' => ['London', 'Manchester', 'Birmingham', 'Glasgow', 'Liverpool', 'Edinburgh', 'Bristol', 'Sheffield', 'Leeds', 'Cardiff'],
            'DEU' => ['Berlin', 'Munich', 'Hamburg', 'Cologne', 'Frankfurt', 'Stuttgart', 'Dusseldorf', 'Dortmund', 'Leipzig', 'Essen'],
            'FRA' => ['Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice', 'Nantes', 'Montpellier', 'Strasbourg', 'Bordeaux', 'Lille'],
            'AUS' => ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Gold Coast', 'Canberra', 'Hobart', 'Darwin', 'Newcastle'],
            'IND' => ['New Delhi', 'Mumbai', 'Kolkata', 'Bangalore', 'Hyderabad', 'Chennai', 'Ahmedabad', 'Pune', 'Jaipur', 'Lucknow'],
            'BRA' => ['São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador', 'Fortaleza', 'Belo Horizonte', 'Manaus', 'Curitiba', 'Recife', 'Porto Alegre'],
            'CHN' => ['Beijing', 'Shanghai', 'Guangzhou', 'Shenzhen', 'Chengdu', 'Hangzhou', 'Xi’an', 'Nanjing', 'Tianjin', 'Wuhan'],
            'JPN' => ['Tokyo', 'Osaka', 'Yokohama', 'Nagoya', 'Sapporo', 'Fukuoka', 'Kobe', 'Kyoto', 'Kawasaki', 'Saitama'],
            'MEX' => ['Mexico City', 'Guadalajara', 'Monterrey', 'Puebla', 'Cancún', 'Tijuana', 'Mérida', 'León', 'San Luis Potosí', 'Querétaro'],
            'ITA' => ['Rome', 'Milan', 'Naples', 'Turin', 'Palermo', 'Genoa', 'Bologna', 'Florence', 'Venice', 'Catania'],
            'ESP' => ['Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Zaragoza', 'Malaga', 'Murcia', 'Palma', 'Las Palmas', 'Bilbao'],
            'RUS' => ['Moscow', 'Saint Petersburg', 'Novosibirsk', 'Yekaterinburg', 'Nizhny Novgorod', 'Samara', 'Omsk', 'Kazan', 'Chelyabinsk', 'Rostov-on-Don'],
            'ZAF' => ['Johannesburg', 'Cape Town', 'Durban', 'Pretoria', 'Port Elizabeth', 'Bloemfontein', 'East London', 'Polokwane', 'Nelspruit', 'Kimberley'],
            'ARG' => ['Buenos Aires', 'Córdoba', 'Rosario', 'Mendoza', 'La Plata', 'San Miguel de Tucumán', 'Mar del Plata', 'Salta', 'Santa Fe', 'San Juan'],
            'KOR' => ['Seoul', 'Busan', 'Incheon', 'Daegu', 'Daejeon', 'Gwangju', 'Ulsan', 'Suwon', 'Changwon', 'Seongnam'],
            'SAU' => ['Riyadh', 'Jeddah', 'Mecca', 'Medina', 'Khobar', 'Dammam', 'Tabuk', 'Abha', 'Al Khobar', 'Najran'],
            'SWE' => ['Stockholm', 'Gothenburg', 'Malmö', 'Uppsala', 'Västerås', 'Örebro', 'Linköping', 'Helsingborg', 'Jönköping', 'Norrköping'],
            'NLD' => ['Amsterdam', 'Rotterdam', 'The Hague', 'Utrecht', 'Eindhoven', 'Groningen', 'Almere', 'Breda', 'Leiden', 'Hilversum'],
            'BEL' => ['Brussels', 'Antwerp', 'Ghent', 'Charleroi', 'Liège', 'Bruges', 'Leuven', 'Namur', 'Mons', 'Kortrijk'],
            'CHE' => ['Zurich', 'Geneva', 'Basel', 'Bern', 'Lucerne', 'Lausanne', 'St. Moritz', 'Zermatt', 'Interlaken', 'Montreux'],
            'DNK' => ['Copenhagen', 'Aarhus', 'Odense', 'Aalborg', 'Esbjerg', 'Randers', 'Kolding', 'Horsens', 'Vejle', 'Herning'],
            'NOR' => ['Oslo', 'Bergen', 'Stavanger', 'Drammen', 'Dundas', 'Trondheim', 'Bodø', 'Tromsø', 'Fredrikstad', 'Porsgrunn'],
            'FIN' => ['Helsinki', 'Espoo', 'Tampere', 'Vantaa', 'Oulu', 'Turku', 'Jyväskylä', 'Lahti', 'Kuopio', 'Pori'],
            'POL' => ['Warsaw', 'Kraków', 'Łódź', 'Wrocław', 'Poznań', 'Gdańsk', 'Szczecin', 'Bydgoszcz', 'Lublin', 'Katowice'],
            'TUR' => ['Istanbul', 'Ankara', 'Izmir', 'Bursa', 'Adana', 'Antalya', 'Konya', 'Gaziantep', 'Mersin', 'Diyarbakır'],
            'EGY' => ['Cairo', 'Alexandria', 'Giza', 'Shubra El Kheima', 'Port Said', 'Suez', 'Luxor', 'Aswan', 'Mansoura', 'Tanta'],
            'ARE' => ['Abu Dhabi', 'Dubai', 'Sharjah', 'Al Ain', 'Ajman', 'Umm Al-Quwain', 'Fujairah', 'Ras Al Khaimah'],
            'GRC' => ['Athens', 'Thessaloniki', 'Patras', 'Heraklion', 'Larissa', 'Volos', 'Ioannina', 'Chania', 'Rhodes', 'Kavala'],
            'SGP' => ['Singapore'],
            'CHL' => ['Santiago', 'Valparaíso', 'Concepción', 'La Serena', 'Antofagasta', 'Temuco', 'Iquique', 'Rancagua', 'Arica', 'Talca'],
            'PER' => ['Lima', 'Arequipa', 'Trujillo', 'Chiclayo', 'Piura', 'Cusco', 'Iquitos', 'Tacna', 'Huancayo', 'Chimbote'],
            'KSA' => ['Riyadh', 'Jeddah', 'Mecca', 'Medina', 'Khobar', 'Dammam', 'Tabuk', 'Abha', 'Al Khobar', 'Najran'],
            'IDN' => ['Jakarta', 'Surabaya', 'Bandung', 'Medan', 'Bekasi', 'Semarang', 'Tangerang', 'Makassar', 'Yogyakarta', 'Palembang'],
            'PHL' => ['Manila', 'Quezon City', 'Cebu City', 'Davao City', 'Makati', 'Cagayan de Oro', 'Taguig', 'Zamboanga City', 'Iloilo City', 'Bacolod'],
            'MYS' => ['Kuala Lumpur', 'George Town', 'Johor Bahru', 'Ipoh', 'Kota Kinabalu', 'Melaka', 'Shah Alam', 'Alor Setar', 'Kuching', 'Miri'],
            'NZL' => ['Auckland', 'Wellington', 'Christchurch', 'Hamilton', 'Dunedin', 'Tauranga', 'Napier-Hastings', 'Palmerston North', 'Rotorua', 'Whangarei'],
        ];
        
        

        // Randomly select a country and city
        $countryISO3 = array_rand($countriesISO3);
        $city = $cities[$countryISO3][array_rand($cities[$countryISO3])];

        // Generate a random warehouse name from the predefined list
        $warehouseName = $warehouseNames[array_rand($warehouseNames)];

        // Generate a realistic address (combining city and country)
        $location = "{$city}, {$countriesISO3[$countryISO3]} ({$countryISO3})";

        // Define realistic capacity and available space ranges
        $capacity = rand(1000, 10000);  // Warehouse capacity (1,000 to 10,000 units)
        $availableSpace = rand(0, $capacity);  // Available space within that range

        return [
            'warehouse_name' => $warehouseName, // Predefined warehouse name
            'location' => $location, // Realistic address format
            'capacity' => $capacity, // Random but realistic capacity
            'available_space' => $availableSpace, // Random available space
            'users_id' => User::factory(), // Associate a user with the warehouse (create a new user if needed)
        ];
    }

}
