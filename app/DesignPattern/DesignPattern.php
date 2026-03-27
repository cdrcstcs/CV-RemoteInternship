<!-- 1. Singleton – Stripe Payment & Translation Service -->
<?php
namespace App\Services;

use Stripe\StripeClient;
use Stichoza\GoogleTranslate\GoogleTranslate;

class PaymentService
{
    private static ?PaymentService $instance = null;
    private StripeClient $stripe;

    private function __construct()
    {
        $this->stripe = new StripeClient(env('STRIPE_SECRET'));
    }

    public static function getInstance(): PaymentService
    {
        if (!self::$instance) {
            self::$instance = new PaymentService();
        }
        return self::$instance;
    }

    public function charge($amount, $currency, $source)
    {
        return $this->stripe->charges->create([
            'amount' => $amount,
            'currency' => $currency,
            'source' => $source,
        ]);
    }
}

class TranslationService
{
    private static ?TranslationService $instance = null;
    private GoogleTranslate $translator;

    private function __construct()
    {
        $this->translator = new GoogleTranslate();
    }

    public static function getInstance(): TranslationService
    {
        if (!self::$instance) {
            self::$instance = new TranslationService();
        }
        return self::$instance;
    }

    public function translate(string $text, string $to = 'en'): string
    {
        return $this->translator->setTarget($to)->translate($text);
    }
}
// 2. Abstract Factory – Products & Orders
<?php
namespace App\Factories;

interface ProductFactoryInterface {
    public function createProduct(): Product;
}

interface OrderFactoryInterface {
    public function createOrder(): Order;
}

// Products
class PhysicalProductFactory implements ProductFactoryInterface {
    public function createProduct(): Product {
        return new Product('Physical');
    }
}

class DigitalProductFactory implements ProductFactoryInterface {
    public function createProduct(): Product {
        return new Product('Digital');
    }
}

// Orders
class StandardOrderFactory implements OrderFactoryInterface {
    public function createOrder(): Order {
        return new Order('Standard');
    }
}

class ExpressOrderFactory implements OrderFactoryInterface {
    public function createOrder(): Order {
        return new Order('Express');
    }
}

// Basic Product & Order classes
class Product {
    public string $type;
    public function __construct(string $type) { $this->type = $type; }
}

class Order {
    public string $type;
    public function __construct(string $type) { $this->type = $type; }
}
// 3. Builder – Complex Order
<?php
namespace App\Builders;

use App\Factories\Order;

class OrderBuilder
{
    private Order $order;

    public function __construct() {
        $this->order = new Order('Custom');
    }

    public function setCoupons(array $coupons): self {
        $this->order->coupons = $coupons;
        return $this;
    }

    public function setGiftWrapping(bool $wrap): self {
        $this->order->giftWrapping = $wrap;
        return $this;
    }

    public function setDiscount(float $discount): self {
        $this->order->discount = $discount;
        return $this;
    }

    public function build(): Order {
        return $this->order;
    }
}
// 4. Observer – Order Notifications
<?php
namespace App\Observers;

interface ObserverInterface {
    public function update(string $event, $data);
}

class OrderSubject {
    private array $observers = [];

    public function attach(ObserverInterface $observer) { $this->observers[] = $observer; }
    public function detach(ObserverInterface $observer) { /* remove logic */ }
    public function notify(string $event, $data) {
        foreach ($this->observers as $observer) {
            $observer->update($event, $data);
        }
    }
}

// Example observer
class UserNotifier implements ObserverInterface {
    public function update(string $event, $data) {
        echo "User notified about $event: " . json_encode($data);
    }
}
// 5. Decorator – Product Enhancements
<?php
namespace App\Decorators;

class BaseProduct {
    public function getDescription(): string { return "Base product"; }
    public function getPrice(): float { return 100; }
}

abstract class ProductDecorator {
    protected BaseProduct $product;
    public function __construct(BaseProduct $product) { $this->product = $product; }
    abstract public function getDescription(): string;
    abstract public function getPrice(): float;
}

class DiscountDecorator extends ProductDecorator {
    private float $discount;
    public function __construct(BaseProduct $product, float $discount) {
        parent::__construct($product);
        $this->discount = $discount;
    }
    public function getDescription(): string { return $this->product->getDescription() . " + Discount"; }
    public function getPrice(): float { return $this->product->getPrice() * (1 - $this->discount); }
}
// 6. Strategy – Payment & Recommendations
<?php
namespace App\Strategies;

interface PaymentStrategy { public function pay(float $amount); }

class StripePayment implements PaymentStrategy {
    public function pay(float $amount) { echo "Pay $amount via Stripe"; }
}
class PayPalPayment implements PaymentStrategy {
    public function pay(float $amount) { echo "Pay $amount via PayPal"; }
}

interface RecommendationStrategy { public function recommend(array $products): array; }

class PopularityRecommendation implements RecommendationStrategy {
    public function recommend(array $products): array { return array_slice($products, 0, 5); }
}
class AIRecommendation implements RecommendationStrategy {
    public function recommend(array $products): array { return $products; /* AI logic */ }
}
// 7. Template Method – Order Processing Pipeline
<?php
namespace App\Templates;

abstract class OrderProcessor {
    public function process() {
        $this->validate();
        $this->payment();
        $this->updateInventory();
        $this->notifyUser();
        $this->generateInvoice();
    }

    abstract protected function validate();
    abstract protected function payment();
    abstract protected function updateInventory();
    abstract protected function notifyUser();
    abstract protected function generateInvoice();
}

class StandardOrderProcessor extends OrderProcessor {
    protected function validate() { echo "Validate order\n"; }
    protected function payment() { echo "Process payment\n"; }
    protected function updateInventory() { echo "Update inventory\n"; }
    protected function notifyUser() { echo "Notify user\n"; }
    protected function generateInvoice() { echo "Generate invoice\n"; }
}

// 1. Singleton – Auth Service & JWT Generator
<?php
namespace App\Services;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use App\Models\User;

class AuthService
{
    private static ?AuthService $instance = null;

    private function __construct() {}

    public static function getInstance(): AuthService
    {
        if (!self::$instance) {
            self::$instance = new AuthService();
        }
        return self::$instance;
    }

    public function generateJwt(User $user): string
    {
        $payload = [
            'sub' => $user->id,
            'email' => $user->email,
            'iat' => time(),
            'exp' => time() + 3600 // 1 hour expiration
        ];
        return JWT::encode($payload, env('JWT_SECRET'), 'HS256');
    }

    public function validateJwt(string $token)
    {
        return JWT::decode($token, new Key(env('JWT_SECRET'), 'HS256'));
    }
}
// 2. Strategy – OTP Delivery & 2FA Verification
<?php
namespace App\Strategies;

interface OtpStrategy {
    public function sendOtp(string $recipient, string $code);
}

class SmsOtpStrategy implements OtpStrategy {
    public function sendOtp(string $recipient, string $code) {
        echo "Sending SMS OTP $code to $recipient\n";
    }
}

class EmailOtpStrategy implements OtpStrategy {
    public function sendOtp(string $recipient, string $code) {
        echo "Sending Email OTP $code to $recipient\n";
    }
}

class OtpService {
    private OtpStrategy $strategy;

    public function __construct(OtpStrategy $strategy) { $this->strategy = $strategy; }

    public function setStrategy(OtpStrategy $strategy) { $this->strategy = $strategy; }

    public function send(string $recipient, string $code) {
        $this->strategy->sendOtp($recipient, $code);
    }
}
// 3. Observer – Profile Changes & Activity Logging
<?php
namespace App\Observers;

interface ObserverInterface {
    public function update(string $event, $data);
}

class UserSubject {
    private array $observers = [];

    public function attach(ObserverInterface $observer) { $this->observers[] = $observer; }

    public function notify(string $event, $data) {
        foreach ($this->observers as $observer) {
            $observer->update($event, $data);
        }
    }
}

// Observers
class ActivityLogger implements ObserverInterface {
    public function update(string $event, $data) {
        echo "Activity log: $event => " . json_encode($data) . "\n";
    }
}

class NotificationService implements ObserverInterface {
    public function update(string $event, $data) {
        echo "Notify user: $event => " . json_encode($data) . "\n";
    }
}
$userSubject = new UserSubject();
$userSubject->attach(new ActivityLogger());
$userSubject->attach(new NotificationService());
$userSubject->notify('profile_updated', ['user_id' => 1]);
// 4. Proxy – Role-Based Access Control
<?php
namespace App\Proxies;

use App\Models\User;

interface UserServiceInterface {
    public function accessResource(User $user, string $resource);
}

class RealUserService implements UserServiceInterface {
    public function accessResource(User $user, string $resource) {
        echo "$user->email accessed $resource\n";
    }
}

class UserServiceProxy implements UserServiceInterface {
    private RealUserService $service;

    public function __construct() { $this->service = new RealUserService(); }

    public function accessResource(User $user, string $resource) {
        if (!in_array($resource, $user->roles->pluck('role_name')->toArray())) {
            echo "Access denied for $user->email to $resource\n";
            return;
        }
        $this->service->accessResource($user, $resource);
    }
}
// 5. Decorator – Premium Features
<?php
namespace App\Decorators;

use App\Models\User;

class BaseUser {
    protected User $user;
    public function __construct(User $user) { $this->user = $user; }
    public function getDescription(): string { return $this->user->email; }
    public function getPrivileges(): array { return ['basic']; }
}

abstract class UserDecorator extends BaseUser {
    abstract public function getDescription(): string;
    abstract public function getPrivileges(): array;
}

class PremiumUserDecorator extends UserDecorator {
    public function getDescription(): string {
        return $this->user->email . " (Premium)";
    }
    public function getPrivileges(): array {
        return array_merge(['premium_support', 'priority_access'], ['basic']);
    }
}

$basicUser = new BaseUser($user);
$premiumUser = new PremiumUserDecorator($user);
echo $premiumUser->getDescription();
print_r($premiumUser->getPrivileges());

// 1. Singleton – Central Route & Vehicle Tracking Service
<?php
namespace App\Services;

use App\Models\RouteOptimization;
use App\Models\Vehicle;

class LogisticsService
{
    private static ?LogisticsService $instance = null;

    private function __construct() {}

    public static function getInstance(): LogisticsService
    {
        if (!self::$instance) {
            self::$instance = new LogisticsService();
        }
        return self::$instance;
    }

    public function calculateRoute(array $locations): array
    {
        // Placeholder: implement route calculation logic
        return ['route' => $locations, 'distance' => rand(10, 100)];
    }

    public function trackVehicle(Vehicle $vehicle): array
    {
        return [
            'vehicle_id' => $vehicle->id,
            'latitude' => $vehicle->current_location['lat'] ?? 0,
            'longitude' => $vehicle->current_location['lng'] ?? 0,
            'status' => $vehicle->status,
        ];
    }
}
// 2. Strategy – Different Route Algorithms
<?php
namespace App\Strategies;

interface RouteStrategy {
    public function calculate(array $locations): array;
}

class ShortestDistanceStrategy implements RouteStrategy {
    public function calculate(array $locations): array {
        return ['algorithm' => 'shortest_distance', 'route' => $locations];
    }
}

class FastestTimeStrategy implements RouteStrategy {
    public function calculate(array $locations): array {
        return ['algorithm' => 'fastest_time', 'route' => $locations];
    }
}

class RouteContext {
    private RouteStrategy $strategy;

    public function __construct(RouteStrategy $strategy) { $this->strategy = $strategy; }
    public function setStrategy(RouteStrategy $strategy) { $this->strategy = $strategy; }
    public function calculateRoute(array $locations): array { return $this->strategy->calculate($locations); }
}
// 3. Observer / Event Bus – Shipment Status Updates
<?php
namespace App\Observers;

interface ObserverInterface {
    public function update(string $event, $data);
}

class ShipmentSubject {
    private array $observers = [];

    public function attach(ObserverInterface $observer) { $this->observers[] = $observer; }
    public function notify(string $event, $data) {
        foreach ($this->observers as $observer) { $observer->update($event, $data); }
    }
}

// Observers
class WarehouseNotifier implements ObserverInterface {
    public function update(string $event, $data) {
        echo "Warehouse notified: $event => " . json_encode($data) . "\n";
    }
}

class DriverNotifier implements ObserverInterface {
    public function update(string $event, $data) {
        echo "Driver notified: $event => " . json_encode($data) . "\n";
    }
}

$shipmentSubject = new ShipmentSubject();
$shipmentSubject->attach(new WarehouseNotifier());
$shipmentSubject->attach(new DriverNotifier());
$shipmentSubject->notify('shipment_dispatched', ['shipment_id' => 101]);

// 4. Facade – Simplify Logistics Operations
<?php
namespace App\Facades;

use App\Services\LogisticsService;
use App\Models\Vehicle;
use App\Models\RouteOptimization;

class LogisticsFacade
{
    private LogisticsService $service;

    public function __construct() {
        $this->service = LogisticsService::getInstance();
    }

    public function assignShipmentToVehicle(int $shipmentId, Vehicle $vehicle, array $routeLocations) {
        $route = $this->service->calculateRoute($routeLocations);
        // Save route optimization
        $routeOpt = RouteOptimization::create([
            'shipments_id' => $shipmentId,
            'total_distance' => $route['distance'],
        ]);
        echo "Shipment $shipmentId assigned to Vehicle {$vehicle->id}\n";
        return $routeOpt;
    }

    public function trackVehicle(Vehicle $vehicle) {
        return $this->service->trackVehicle($vehicle);
    }
}
// 5. Command – Schedule Background Logistics Tasks
<?php
namespace App\Commands;

use App\Facades\LogisticsFacade;
use App\Models\Vehicle;

interface CommandInterface {
    public function execute();
}

// Command to assign shipment
class AssignShipmentCommand implements CommandInterface {
    private int $shipmentId;
    private Vehicle $vehicle;
    private array $routeLocations;

    public function __construct(int $shipmentId, Vehicle $vehicle, array $routeLocations) {
        $this->shipmentId = $shipmentId;
        $this->vehicle = $vehicle;
        $this->routeLocations = $routeLocations;
    }

    public function execute() {
        $facade = new LogisticsFacade();
        return $facade->assignShipmentToVehicle($this->shipmentId, $this->vehicle, $this->routeLocations);
    }
}

// Command Scheduler
class CommandScheduler {
    private array $commands = [];
    public function addCommand(CommandInterface $command) { $this->commands[] = $command; }
    public function run() {
        foreach ($this->commands as $command) { $command->execute(); }
        $this->commands = [];
    }
}

$vehicle = Vehicle::find(1);
$commandScheduler = new CommandScheduler();
$commandScheduler->addCommand(new AssignShipmentCommand(101, $vehicle, [['lat'=>0,'lng'=>0], ['lat'=>1,'lng'=>1]]));
$commandScheduler->run();
// 1. Observer / Publish-Subscribe – Real-time Messaging & Gifts
<?php
namespace App\Observers;

interface ObserverInterface {
    public function update(string $event, $data);
}

class StreamSubject {
    private array $observers = [];

    public function attach(ObserverInterface $observer) { $this->observers[] = $observer; }
    public function detach(ObserverInterface $observer) { 
        $this->observers = array_filter($this->observers, fn($o) => $o !== $observer);
    }
    public function notify(string $event, $data) {
        foreach ($this->observers as $observer) {
            $observer->update($event, $data);
        }
    }
}

// Observers
class ChatObserver implements ObserverInterface {
    public function update(string $event, $data) {
        if($event === 'new_message') {
            echo "New chat message from {$data['user_name']}: {$data['message']}\n";
        }
    }
}

class GiftObserver implements ObserverInterface {
    public function update(string $event, $data) {
        if($event === 'new_gift') {
            echo "{$data['user_name']} sent a {$data['gift_name']} worth \${$data['price']}\n";
        }
    }
}

$stream = new StreamSubject();
$stream->attach(new ChatObserver());
$stream->attach(new GiftObserver());

$stream->notify('new_message', ['user_name'=>'Alice', 'message'=>'Hello!']);
$stream->notify('new_gift', ['user_name'=>'Bob', 'gift_name'=>'Lion', 'price'=>100]);
// 2. Mediator – Manage Participant Communication
<?php
namespace App\Mediators;

use App\Models\User;

class StreamMediator {
    private array $participants = [];

    public function join(User $user) {
        $this->participants[$user->id] = $user;
    }

    public function leave(User $user) {
        unset($this->participants[$user->id]);
    }

    public function broadcastMessage(User $sender, string $message) {
        foreach ($this->participants as $user) {
            if($user->id !== $sender->id) {
                echo "Message to {$user->first_name}: {$sender->first_name} says '$message'\n";
            }
        }
    }
}

$mediator = new StreamMediator();
$alice = User::find(1);
$bob = User::find(2);
$mediator->join($alice);
$mediator->join($bob);
$mediator->broadcastMessage($alice, "Welcome to my stream!");
// 3. Strategy – Dynamic Engagement Features
<?php
namespace App\Strategies;

interface GiftingStrategy {
    public function calculatePoints(int $giftPrice): int;
}

class StandardGiftingStrategy implements GiftingStrategy {
    public function calculatePoints(int $giftPrice): int {
        return $giftPrice * 1; // 1 point per dollar
    }
}

class PremiumGiftingStrategy implements GiftingStrategy {
    public function calculatePoints(int $giftPrice): int {
        return $giftPrice * 2; // 2 points per dollar for premium users
    }
}

class GiftContext {
    private GiftingStrategy $strategy;

    public function __construct(GiftingStrategy $strategy) { $this->strategy = $strategy; }
    public function setStrategy(GiftingStrategy $strategy) { $this->strategy = $strategy; }
    public function calculatePoints(int $giftPrice): int { return $this->strategy->calculatePoints($giftPrice); }
}

$giftContext = new GiftContext(new StandardGiftingStrategy());
echo $giftContext->calculatePoints(100); // 100 points
$giftContext->setStrategy(new PremiumGiftingStrategy());
echo $giftContext->calculatePoints(100); // 200 points
// 4. Command – Actions in the Stream
<?php
namespace App\Commands;

use App\Models\User;
use App\Models\Stream;
use App\Models\StreamGift;

interface CommandInterface {
    public function execute();
}

// Send gift
class SendGiftCommand implements CommandInterface {
    private User $sender;
    private Stream $stream;
    private string $giftType;
    private int $price;

    public function __construct(User $sender, Stream $stream, string $giftType, int $price) {
        $this->sender = $sender;
        $this->stream = $stream;
        $this->giftType = $giftType;
        $this->price = $price;
    }

    public function execute() {
        StreamGift::create([
            'owner_id' => $this->sender->id,
            'gift_type' => $this->giftType,
            'price' => $this->price,
            'stream_id' => $this->stream->id,
        ]);
        echo "{$this->sender->first_name} sent {$this->giftType} to Stream {$this->stream->id}\n";
    }
}

// Post message
class PostMessageCommand implements CommandInterface {
    private User $sender;
    private Stream $stream;
    private string $message;

    public function __construct(User $sender, Stream $stream, string $message) {
        $this->sender = $sender;
        $this->stream = $stream;
        $this->message = $message;
    }

    public function execute() {
        $this->stream->streamMessages()->create([
            'creator_id' => $this->sender->id,
            'stream_id' => $this->stream->id,
            'message' => $this->message,
        ]);
        echo "{$this->sender->first_name} posted message: {$this->message}\n";
    }
}

// Command scheduler
class CommandScheduler {
    private array $commands = [];
    public function addCommand(CommandInterface $command) { $this->commands[] = $command; }
    public function run() {
        foreach ($this->commands as $command) { $command->execute(); }
        $this->commands = [];
    }
}

$scheduler = new CommandScheduler();
$alice = User::find(1);
$stream = Stream::find(1);

$scheduler->addCommand(new SendGiftCommand($alice, $stream, 'Lion', 100));
$scheduler->addCommand(new PostMessageCommand($alice, $stream, 'Hello everyone!'));
$scheduler->run();

// 1. Observer – Real-time Notifications
<?php
namespace App\Observers;

interface ObserverInterface {
    public function update(string $event, $data);
}

class UserSubject {
    private array $observers = [];

    public function attach(ObserverInterface $observer) { $this->observers[] = $observer; }
    public function detach(ObserverInterface $observer) { 
        $this->observers = array_filter($this->observers, fn($o) => $o !== $observer);
    }

    public function notify(string $event, $data) {
        foreach ($this->observers as $observer) {
            $observer->update($event, $data);
        }
    }
}

// Observers
class NotificationObserver implements ObserverInterface {
    public function update(string $event, $data) {
        switch($event) {
            case 'post_liked':
                echo "{$data['user_name']}, your post {$data['post_id']} was liked by {$data['actor_name']}\n";
                break;
            case 'new_comment':
                echo "{$data['user_name']}, new comment on your post {$data['post_id']} by {$data['actor_name']}\n";
                break;
            case 'new_message':
                echo "{$data['user_name']}, new message from {$data['actor_name']}: {$data['message']}\n";
                break;
        }
    }
}

$userSubject = new UserSubject();
$userSubject->attach(new NotificationObserver());

$userSubject->notify('post_liked', [
    'user_name'=>'Alice', 'post_id'=>101, 'actor_name'=>'Bob'
]);
$userSubject->notify('new_message', [
    'user_name'=>'Alice', 'message'=>'Hello!', 'actor_name'=>'Bob'
]);
// 2. Mediator – Centralized Group Chat Management
<?php
namespace App\Mediators;

use App\Models\User;

class GroupChatMediator {
    private array $participants = [];

    public function join(User $user) { $this->participants[$user->id] = $user; }
    public function leave(User $user) { unset($this->participants[$user->id]); }

    public function broadcastMessage(User $sender, string $message) {
        foreach ($this->participants as $user) {
            if($user->id !== $sender->id) {
                echo "Message to {$user->first_name}: {$sender->first_name} says '{$message}'\n";
            }
        }
    }
}

$mediator = new GroupChatMediator();
$alice = User::find(1);
$bob = User::find(2);

$mediator->join($alice);
$mediator->join($bob);
$mediator->broadcastMessage($alice, "Hey team!");
// 3. Command – Sending & Moderating Messages
<?php
namespace App\Commands;

use App\Models\User;
use App\Models\Message;

interface CommandInterface { public function execute(); }

class SendMessageCommand implements CommandInterface {
    private User $sender;
    private User $receiver;
    private string $message;

    public function __construct(User $sender, User $receiver, string $message) {
        $this->sender = $sender;
        $this->receiver = $receiver;
        $this->message = $message;
    }

    public function execute() {
        Message::create([
            'sender_id' => $this->sender->id,
            'receiver_id' => $this->receiver->id,
            'message' => $this->message,
        ]);
        echo "{$this->sender->first_name} sent message to {$this->receiver->first_name}: {$this->message}\n";
    }
}

class DeleteMessageCommand implements CommandInterface {
    private Message $message;
    public function __construct(Message $message) { $this->message = $message; }
    public function execute() {
        $this->message->delete();
        echo "Message {$this->message->id} deleted\n";
    }
}

// Command scheduler
class CommandScheduler {
    private array $commands = [];
    public function addCommand(CommandInterface $command) { $this->commands[] = $command; }
    public function run() { foreach($this->commands as $c) $c->execute(); $this->commands = []; }
}
// 4. Decorator – Add Features to Messages
<?php
namespace App\Decorators;

interface MessageInterface { public function getContent(): string; }

class BaseMessage implements MessageInterface {
    private string $content;
    public function __construct(string $content) { $this->content = $content; }
    public function getContent(): string { return $this->content; }
}

// Decorators
class ReactionDecorator implements MessageInterface {
    private MessageInterface $message;
    private string $reaction;
    public function __construct(MessageInterface $message, string $reaction) { $this->message = $message; $this->reaction = $reaction; }
    public function getContent(): string { return $this->message->getContent() . " [Reaction: {$this->reaction}]"; }
}

class AttachmentDecorator implements MessageInterface {
    private MessageInterface $message;
    private string $attachment;
    public function __construct(MessageInterface $message, string $attachment) { $this->message = $message; $this->attachment = $attachment; }
    public function getContent(): string { return $this->message->getContent() . " [Attachment: {$this->attachment}]"; }
}

$msg = new BaseMessage("Hello!");
$msg = new ReactionDecorator($msg, "❤️");
$msg = new AttachmentDecorator($msg, "image.png");
echo $msg->getContent(); // Hello! [Reaction: ❤️] [Attachment: image.png]
// 5. Strategy – Moderation / Spam Detection
<?php
namespace App\Strategies;

interface ModerationStrategy {
    public function check(string $message): bool;
}

class BasicModeration implements ModerationStrategy {
    public function check(string $message): bool {
        $badWords = ['spam','badword'];
        foreach($badWords as $word) if(stripos($message,$word)!==false) return false;
        return true;
    }
}

class AITextModeration implements ModerationStrategy {
    public function check(string $message): bool {
        // Dummy AI check (replace with actual ML model/API)
        return strlen($message) < 200; // Reject very long messages
    }
}

class ModerationContext {
    private ModerationStrategy $strategy;
    public function __construct(ModerationStrategy $strategy) { $this->strategy = $strategy; }
    public function setStrategy(ModerationStrategy $strategy) { $this->strategy = $strategy; }
    public function checkMessage(string $message): bool { return $this->strategy->check($message); }
}

$moderator = new ModerationContext(new BasicModeration());
var_dump($moderator->checkMessage("Hello world")); // true
$moderator->setStrategy(new AITextModeration());
var_dump($moderator->checkMessage(str_repeat("x", 300))); // false
// 1. Strategy – AI Chatbot & Media Editing
<?php
namespace App\Strategies;

interface ChatbotStrategy {
    public function getResponse(string $message): string;
}

class GeminiChatbot implements ChatbotStrategy {
    public function getResponse(string $message): string {
        // Call Gemini AI API (pseudo)
        return "Gemini AI Response to: {$message}";
    }
}

class OpenAIChatbot implements ChatbotStrategy {
    public function getResponse(string $message): string {
        // Call OpenAI API (pseudo)
        return "OpenAI Response to: {$message}";
    }
}

class ChatbotContext {
    private ChatbotStrategy $strategy;
    
    public function __construct(ChatbotStrategy $strategy) { $this->strategy = $strategy; }
    public function setStrategy(ChatbotStrategy $strategy) { $this->strategy = $strategy; }
    public function getResponse(string $message): string { return $this->strategy->getResponse($message); }
}

// Media Editing Strategies
interface MediaEditStrategy {
    public function apply(string $filePath): string;
}

class ResizeStrategy implements MediaEditStrategy {
    private int $width;
    private int $height;
    public function __construct(int $width, int $height) { $this->width = $width; $this->height = $height; }
    public function apply(string $filePath): string { return "{$filePath} resized to {$this->width}x{$this->height}"; }
}

class FilterStrategy implements MediaEditStrategy {
    private string $filter;
    public function __construct(string $filter) { $this->filter = $filter; }
    public function apply(string $filePath): string { return "{$filePath} with filter {$this->filter} applied"; }
}

class MediaEditorContext {
    private MediaEditStrategy $strategy;
    public function __construct(MediaEditStrategy $strategy) { $this->strategy = $strategy; }
    public function setStrategy(MediaEditStrategy $strategy) { $this->strategy = $strategy; }
    public function edit(string $filePath): string { return $this->strategy->apply($filePath); }
}
// 2. Facade – Simplified AI & Cloudinary Access
<?php
namespace App\Facades;

use App\Strategies\ChatbotContext;
use App\Strategies\GeminiChatbot;
use App\Strategies\OpenAIChatbot;
use App\Strategies\MediaEditorContext;
use App\Strategies\ResizeStrategy;
use App\Strategies\FilterStrategy;

class AIServiceFacade {
    public function getChatbotResponse(string $message, string $type = 'gemini'): string {
        $context = $type === 'openai' ? new ChatbotContext(new OpenAIChatbot()) : new ChatbotContext(new GeminiChatbot());
        return $context->getResponse($message);
    }

    public function editMedia(string $filePath, array $operations): string {
        $result = $filePath;
        foreach($operations as $op) {
            if($op['type'] === 'resize') {
                $editor = new MediaEditorContext(new ResizeStrategy($op['width'], $op['height']));
            } elseif($op['type'] === 'filter') {
                $editor = new MediaEditorContext(new FilterStrategy($op['filter']));
            }
            $result = $editor->edit($result);
        }
        return $result;
    }

    public function recognizeNumberPlate(string $imagePath): string {
        // Simplified ANPR pseudo-implementation
        return "Recognized number plate: ABC-1234 from {$imagePath}";
    }
}
$aiFacade = new AIServiceFacade();
echo $aiFacade->getChatbotResponse("Hello AI"); 
echo $aiFacade->editMedia("video.mp4", [['type'=>'resize','width'=>800,'height'=>600],['type'=>'filter','filter'=>'sepia']]);
echo $aiFacade->recognizeNumberPlate("car.jpg");
// 3. Decorator – Media Transformations
<?php
namespace App\Decorators;

interface MediaInterface { public function getPath(): string; }

class BaseMedia implements MediaInterface {
    protected string $path;
    public function __construct(string $path) { $this->path = $path; }
    public function getPath(): string { return $this->path; }
}

// Decorators
class WatermarkDecorator implements MediaInterface {
    private MediaInterface $media;
    private string $watermark;
    public function __construct(MediaInterface $media, string $watermark) { $this->media = $media; $this->watermark = $watermark; }
    public function getPath(): string { return $this->media->getPath() . " + watermark '{$this->watermark}'"; }
}

class CompressionDecorator implements MediaInterface {
    private MediaInterface $media;
    public function __construct(MediaInterface $media) { $this->media = $media; }
    public function getPath(): string { return $this->media->getPath() . " + compressed"; }
}

$media = new BaseMedia("image.jpg");
$media = new WatermarkDecorator($media, "MyBrand");
$media = new CompressionDecorator($media);
echo $media->getPath(); // image.jpg + watermark 'MyBrand' + compressed
// 4. Observer – AI Chatbot Context Updates
<?php
namespace App\Observers;

interface AIObserverInterface { public function update(string $event, $data); }

class AIUserSubject {
    private array $observers = [];
    public function attach(AIObserverInterface $observer) { $this->observers[] = $observer; }
    public function detach(AIObserverInterface $observer) { $this->observers = array_filter($this->observers, fn($o) => $o !== $observer); }
    public function notify(string $event, $data) { foreach($this->observers as $observer) $observer->update($event, $data); }
}

class ChatbotLoggerObserver implements AIObserverInterface {
    public function update(string $event, $data) {
        echo "[ChatbotLog] Event: {$event}, Message: {$data['message']}, User: {$data['user_name']}\n";
    }
}

$subject = new AIUserSubject();
$subject->attach(new ChatbotLoggerObserver());
$subject->notify('chatbot_response', ['user_name'=>'Alice','message'=>'Hello AI']);





// 1. Singleton – Centralized Configuration Management
<?php
namespace App\Services;

class ConfigManager
{
    private static ?ConfigManager $instance = null;
    private array $config = [];

    private function __construct() {
        // Load default configuration (from .env or config files)
        $this->config = [
            'docker_image' => env('DOCKER_IMAGE', 'myapp:latest'),
            'kubernetes_namespace' => env('KUBE_NAMESPACE', 'default'),
            'queue_connection' => env('QUEUE_CONNECTION', 'database'),
        ];
    }

    public static function getInstance(): ConfigManager {
        if (self::$instance === null) {
            self::$instance = new ConfigManager();
        }
        return self::$instance;
    }

    public function get(string $key, $default = null) {
        return $this->config[$key] ?? $default;
    }

    public function set(string $key, $value) {
        $this->config[$key] = $value;
    }
}
$config = ConfigManager::getInstance();
echo $config->get('docker_image'); // myapp:latest
$config->set('queue_connection', 'redis');
// 2. Command / Job Queue – Background Tasks
<?php
namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SendEmailJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    private string $to;
    private string $subject;
    private string $body;

    public function __construct(string $to, string $subject, string $body)
    {
        $this->to = $to;
        $this->subject = $subject;
        $this->body = $body;
    }

    public function handle()
    {
        // Laravel Mail::send() or any email service
        echo "Sending email to {$this->to}: {$this->subject}\n";
    }
}

class GenerateReportJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    private string $reportType;

    public function __construct(string $reportType) { $this->reportType = $reportType; }

    public function handle() {
        echo "Generating {$this->reportType} report...\n";
    }
}
// Dispatching jobs:
SendEmailJob::dispatch('user@example.com', 'Welcome', 'Hello!')->onQueue('emails');
GenerateReportJob::dispatch('sales')->onQueue('reports');
// 3. Observer / Event Bus – Event-Driven Actions
<?php
namespace App\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class OrderCreatedEvent
{
    use Dispatchable, SerializesModels;

    public array $orderData;

    public function __construct(array $orderData) { $this->orderData = $orderData; }
}
<?php
namespace App\Listeners;

use App\Events\OrderCreatedEvent;
use App\Jobs\SendEmailJob;
use App\Jobs\GenerateReportJob;

class OrderEventListener
{
    public function handle(OrderCreatedEvent $event)
    {
        // Trigger warehouse notification, shipment, analytics
        SendEmailJob::dispatch($event->orderData['user_email'], 'Order Confirmation', 'Your order is confirmed');
        GenerateReportJob::dispatch('daily_orders');
        echo "Listener handled OrderCreatedEvent for Order ID: {$event->orderData['id']}\n";
    }
}
event(new OrderCreatedEvent(['id'=>123, 'user_email'=>'user@example.com']));

// 4. Template Method – CI/CD Pipeline Abstraction
<?php
namespace App\Services\CI;

abstract class Pipeline
{
    // Template Method
    public final function executePipeline()
    {
        $this->build();
        $this->test();
        $this->deploy();
        $this->notify();
    }

    abstract protected function build();
    abstract protected function test();
    abstract protected function deploy();

    protected function notify() {
        echo "Pipeline finished. Sending notification...\n";
    }
}

// Concrete Pipeline
class DockerKubernetesPipeline extends Pipeline
{
    protected function build() {
        echo "Building Docker image...\n";
    }

    protected function test() {
        echo "Running unit and integration tests...\n";
    }

    protected function deploy() {
        echo "Deploying to Kubernetes namespace...\n";
    }
}

// Execute
$pipeline = new DockerKubernetesPipeline();
$pipeline->executePipeline();