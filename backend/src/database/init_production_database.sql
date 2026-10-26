--
-- PostgreSQL database dump
--

-- Dumped from database version 16.15
-- Dumped by pg_dump version 16.15

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public.products DROP CONSTRAINT IF EXISTS products_category_id_fkey;
ALTER TABLE IF EXISTS ONLY public.orders DROP CONSTRAINT IF EXISTS orders_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.order_items DROP CONSTRAINT IF EXISTS order_items_product_id_fkey;
ALTER TABLE IF EXISTS ONLY public.order_items DROP CONSTRAINT IF EXISTS order_items_order_id_fkey;
ALTER TABLE IF EXISTS ONLY public.news DROP CONSTRAINT IF EXISTS news_author_id_fkey;
ALTER TABLE IF EXISTS ONLY public.categories DROP CONSTRAINT IF EXISTS categories_parent_id_fkey;
ALTER TABLE IF EXISTS ONLY public.addresses DROP CONSTRAINT IF EXISTS addresses_user_id_fkey;
DROP INDEX IF EXISTS public.idx_products_slug;
DROP INDEX IF EXISTS public.idx_products_category;
DROP INDEX IF EXISTS public.idx_products_best_seller;
DROP INDEX IF EXISTS public.idx_policies_slug;
DROP INDEX IF EXISTS public.idx_orders_user;
DROP INDEX IF EXISTS public.idx_orders_code;
DROP INDEX IF EXISTS public.idx_order_items_order;
DROP INDEX IF EXISTS public.idx_news_slug;
DROP INDEX IF EXISTS public.idx_news_published;
DROP INDEX IF EXISTS public.idx_news_created_at;
DROP INDEX IF EXISTS public.idx_news_category;
DROP INDEX IF EXISTS public.idx_categories_parent;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_pkey;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_phone_number_key;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_email_key;
ALTER TABLE IF EXISTS ONLY public.products DROP CONSTRAINT IF EXISTS products_slug_key;
ALTER TABLE IF EXISTS ONLY public.products DROP CONSTRAINT IF EXISTS products_pkey;
ALTER TABLE IF EXISTS ONLY public.policies DROP CONSTRAINT IF EXISTS policies_slug_key;
ALTER TABLE IF EXISTS ONLY public.policies DROP CONSTRAINT IF EXISTS policies_pkey;
ALTER TABLE IF EXISTS ONLY public.orders DROP CONSTRAINT IF EXISTS orders_pkey;
ALTER TABLE IF EXISTS ONLY public.orders DROP CONSTRAINT IF EXISTS orders_order_code_key;
ALTER TABLE IF EXISTS ONLY public.order_items DROP CONSTRAINT IF EXISTS order_items_pkey;
ALTER TABLE IF EXISTS ONLY public.news DROP CONSTRAINT IF EXISTS news_slug_key;
ALTER TABLE IF EXISTS ONLY public.news DROP CONSTRAINT IF EXISTS news_pkey;
ALTER TABLE IF EXISTS ONLY public.categories DROP CONSTRAINT IF EXISTS categories_slug_key;
ALTER TABLE IF EXISTS ONLY public.categories DROP CONSTRAINT IF EXISTS categories_pkey;
ALTER TABLE IF EXISTS ONLY public.addresses DROP CONSTRAINT IF EXISTS addresses_pkey;
ALTER TABLE IF EXISTS public.users ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.products ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.policies ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.orders ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.order_items ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.news ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.categories ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.addresses ALTER COLUMN id DROP DEFAULT;
DROP SEQUENCE IF EXISTS public.users_id_seq;
DROP TABLE IF EXISTS public.users;
DROP SEQUENCE IF EXISTS public.products_id_seq;
DROP TABLE IF EXISTS public.products;
DROP SEQUENCE IF EXISTS public.policies_id_seq;
DROP TABLE IF EXISTS public.policies;
DROP SEQUENCE IF EXISTS public.orders_id_seq;
DROP TABLE IF EXISTS public.orders;
DROP SEQUENCE IF EXISTS public.order_items_id_seq;
DROP TABLE IF EXISTS public.order_items;
DROP SEQUENCE IF EXISTS public.news_id_seq;
DROP TABLE IF EXISTS public.news;
DROP SEQUENCE IF EXISTS public.categories_id_seq;
DROP TABLE IF EXISTS public.categories;
DROP SEQUENCE IF EXISTS public.addresses_id_seq;
DROP TABLE IF EXISTS public.addresses;
SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: addresses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.addresses (
    id integer NOT NULL,
    user_id integer NOT NULL,
    recipient_name character varying(150) NOT NULL,
    phone_number character varying(20) NOT NULL,
    province character varying(100) NOT NULL,
    district character varying(100) NOT NULL,
    ward character varying(100) NOT NULL,
    street_address character varying(255) NOT NULL,
    is_default boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.addresses OWNER TO postgres;

--
-- Name: addresses_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.addresses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.addresses_id_seq OWNER TO postgres;

--
-- Name: addresses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.addresses_id_seq OWNED BY public.addresses.id;


--
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    parent_id integer,
    name character varying(150) NOT NULL,
    slug character varying(180) NOT NULL,
    description text,
    icon_name character varying(100),
    sort_order integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categories_id_seq OWNER TO postgres;

--
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- Name: news; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.news (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    slug character varying(280) NOT NULL,
    summary text NOT NULL,
    content text NOT NULL,
    thumbnail_url character varying(500) NOT NULL,
    category character varying(50) DEFAULT 'TIN_TRANG_TRAI'::character varying NOT NULL,
    is_published boolean DEFAULT true NOT NULL,
    views integer DEFAULT 0 NOT NULL,
    author_id integer,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT news_category_check CHECK (((category)::text = ANY ((ARRAY['TIN_TRANG_TRAI'::character varying, 'KIEN_THUC'::character varying, 'THONG_BAO'::character varying])::text[])))
);


ALTER TABLE public.news OWNER TO postgres;

--
-- Name: news_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.news_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.news_id_seq OWNER TO postgres;

--
-- Name: news_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.news_id_seq OWNED BY public.news.id;


--
-- Name: order_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_items (
    id integer NOT NULL,
    order_id integer NOT NULL,
    product_id integer,
    product_name character varying(255) NOT NULL,
    unit_price numeric(14,2) NOT NULL,
    quantity numeric(10,2) NOT NULL,
    total_price numeric(14,2) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT order_items_quantity_check CHECK ((quantity > (0)::numeric)),
    CONSTRAINT order_items_total_price_check CHECK ((total_price >= (0)::numeric)),
    CONSTRAINT order_items_unit_price_check CHECK ((unit_price >= (0)::numeric))
);


ALTER TABLE public.order_items OWNER TO postgres;

--
-- Name: order_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.order_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.order_items_id_seq OWNER TO postgres;

--
-- Name: order_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.order_items_id_seq OWNED BY public.order_items.id;


--
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
    id integer NOT NULL,
    order_code character varying(50) NOT NULL,
    user_id integer,
    recipient_name character varying(150) NOT NULL,
    recipient_phone character varying(20) NOT NULL,
    shipping_address text NOT NULL,
    notes text,
    subtotal numeric(14,2) NOT NULL,
    shipping_fee numeric(14,2) DEFAULT 0 NOT NULL,
    total_amount numeric(14,2) NOT NULL,
    payment_method character varying(50) DEFAULT 'COD'::character varying NOT NULL,
    payment_status character varying(50) DEFAULT 'PENDING'::character varying NOT NULL,
    order_status character varying(50) DEFAULT 'PENDING'::character varying NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    proof_image_url text,
    proof_note text,
    CONSTRAINT orders_order_status_check CHECK (((order_status)::text = ANY ((ARRAY['PENDING'::character varying, 'CONFIRMED'::character varying, 'PROCESSING'::character varying, 'SHIPPING'::character varying, 'DELIVERED'::character varying, 'CANCELLED'::character varying])::text[]))),
    CONSTRAINT orders_payment_method_check CHECK (((payment_method)::text = ANY ((ARRAY['COD'::character varying, 'BANK_TRANSFER'::character varying, 'VNPAY'::character varying, 'MOMO'::character varying])::text[]))),
    CONSTRAINT orders_payment_status_check CHECK (((payment_status)::text = ANY ((ARRAY['PENDING'::character varying, 'PAID'::character varying, 'FAILED'::character varying, 'REFUNDED'::character varying])::text[]))),
    CONSTRAINT orders_shipping_fee_check CHECK ((shipping_fee >= (0)::numeric)),
    CONSTRAINT orders_subtotal_check CHECK ((subtotal >= (0)::numeric)),
    CONSTRAINT orders_total_amount_check CHECK ((total_amount >= (0)::numeric))
);


ALTER TABLE public.orders OWNER TO postgres;

--
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.orders_id_seq OWNER TO postgres;

--
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;


--
-- Name: policies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.policies (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    slug character varying(280) NOT NULL,
    content text NOT NULL,
    type character varying(50) NOT NULL,
    sort_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT policies_type_check CHECK (((type)::text = ANY ((ARRAY['CAM_KET'::character varying, 'BAN_HANG'::character varying, 'THANH_TOAN'::character varying, 'DOI_TRA'::character varying, 'GIAO_HANG'::character varying, 'BAO_MAT'::character varying])::text[])))
);


ALTER TABLE public.policies OWNER TO postgres;

--
-- Name: policies_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.policies_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.policies_id_seq OWNER TO postgres;

--
-- Name: policies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.policies_id_seq OWNED BY public.policies.id;


--
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id integer NOT NULL,
    category_id integer NOT NULL,
    name character varying(255) NOT NULL,
    slug character varying(280) NOT NULL,
    image_url character varying(500) NOT NULL,
    secondary_images jsonb DEFAULT '[]'::jsonb,
    unit character varying(50) DEFAULT 'Kg'::character varying NOT NULL,
    specification character varying(100) DEFAULT 'Túi 1kg'::character varying NOT NULL,
    price numeric(14,2) NOT NULL,
    sale_price numeric(14,2),
    stock_quantity numeric(10,2) DEFAULT 0.00 NOT NULL,
    certification character varying(50),
    origin character varying(150) DEFAULT 'Trang trại VFT Farms'::character varying,
    is_featured boolean DEFAULT false,
    is_best_seller boolean DEFAULT false,
    description text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT products_certification_check CHECK (((certification)::text = ANY ((ARRAY['VietGAP'::character varying, 'VfSC'::character varying, 'Organic'::character varying, 'HACCP'::character varying])::text[]))),
    CONSTRAINT products_price_check CHECK ((price >= (0)::numeric)),
    CONSTRAINT products_sale_price_check CHECK ((sale_price >= (0)::numeric)),
    CONSTRAINT products_stock_quantity_check CHECK ((stock_quantity >= (0)::numeric))
);


ALTER TABLE public.products OWNER TO postgres;

--
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.products_id_seq OWNER TO postgres;

--
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    full_name character varying(150) NOT NULL,
    email character varying(150) NOT NULL,
    phone_number character varying(20) NOT NULL,
    password_hash character varying(255) NOT NULL,
    role character varying(20) DEFAULT 'CUSTOMER'::character varying NOT NULL,
    avatar_url text,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT users_role_check CHECK (((role)::text = ANY ((ARRAY['CUSTOMER'::character varying, 'ADMIN'::character varying, 'STAFF'::character varying])::text[])))
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: addresses id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.addresses ALTER COLUMN id SET DEFAULT nextval('public.addresses_id_seq'::regclass);


--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- Name: news id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.news ALTER COLUMN id SET DEFAULT nextval('public.news_id_seq'::regclass);


--
-- Name: order_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items ALTER COLUMN id SET DEFAULT nextval('public.order_items_id_seq'::regclass);


--
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);


--
-- Name: policies id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.policies ALTER COLUMN id SET DEFAULT nextval('public.policies_id_seq'::regclass);


--
-- Name: products id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: addresses; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.categories VALUES (1, NULL, 'Rau Củ Tươi Sạch', 'rau-cu-tuoi-sach', 'Rau ăn lá, củ quả tươi ngon đạt tiêu chuẩn VietGAP, canh tác hữu cơ tự nhiên', NULL, 1, true, '2026-10-25 11:41:05.361365+00', '2026-10-25 11:41:05.361365+00');
INSERT INTO public.categories VALUES (2, NULL, 'Trái Cây Đặc Sản', 'trai-cay-dac-san', 'Trái cây nhiệt đới đặc sản các vùng miền, chín cây tự nhiên mọng nước', NULL, 2, true, '2026-10-25 11:41:05.361365+00', '2026-10-25 11:41:05.361365+00');
INSERT INTO public.categories VALUES (3, NULL, 'Thịt Sạch Thảo Mộc', 'thit-sach-thao-moc', 'Thịt heo, bò, gà chăn nuôi tự nhiên an toàn sinh học bằng thảo mộc', NULL, 3, true, '2026-10-25 11:41:05.361365+00', '2026-10-25 11:41:05.361365+00');
INSERT INTO public.categories VALUES (4, NULL, 'Thủy Hải Sản Tự Nhiên', 'thuy-hai-san-tu-nhien', 'Thủy hải sản tươi sống đánh bắt và nuôi trồng sinh thái chuẩn sạch', NULL, 4, true, '2026-10-25 11:41:05.361365+00', '2026-10-25 11:41:05.361365+00');
INSERT INTO public.categories VALUES (5, NULL, 'Trứng & Sữa Thanh Trùng', 'trung-sua-thanh-trung', 'Trứng gà ta thảo dược, sữa tươi thanh trùng nguyên chất trang trại', NULL, 5, true, '2026-10-25 11:41:05.361365+00', '2026-10-25 11:41:05.361365+00');
INSERT INTO public.categories VALUES (6, NULL, 'Gạo & Ngũ Cốc Bản Địa', 'gao-ngu-coc-ban-dia', 'Gạo hữu cơ ST25, gạo lứt, yến mạch và các loại đậu hạt dinh dưỡng', NULL, 6, true, '2026-10-25 11:41:05.361365+00', '2026-10-25 11:41:05.361365+00');
INSERT INTO public.categories VALUES (7, NULL, 'Nấm Tươi & Thảo Dược', 'nam-tuoi-thao-duoc', 'Nấm đông cô, nấm mối, linh chi và thảo mộc bồi bổ sức khỏe tự nhiên', NULL, 7, true, '2026-10-25 11:41:05.361365+00', '2026-10-25 11:41:05.361365+00');
INSERT INTO public.categories VALUES (8, NULL, 'Mật Ong & Trà Tự Nhiên', 'mat-ong-tra-tu-nhien', 'Mật ong rừng nguyên chất, trà Shan tuyết cổ thụ, trà Oolong hảo hạng', NULL, 8, true, '2026-10-25 11:41:05.361365+00', '2026-10-25 11:41:05.361365+00');
INSERT INTO public.categories VALUES (9, NULL, 'Gia Vị & Nông Sản Chế Biến', 'gia-vi-nong-san-che-bien', 'Nước mắm truyền thống cốt nhĩ, tiêu đen, muối hầm và đặc sản sấy dẻo', NULL, 9, true, '2026-10-25 11:41:05.361365+00', '2026-10-25 11:41:05.361365+00');
INSERT INTO public.categories VALUES (10, NULL, 'Chế Phẩm Sinh Học & Vật Tư', 'che-pham-sinh-hoc-vat-tu', 'Men vi sinh VFT Bio, phân bón hữu cơ sinh học, hạt giống rau sạch F1', NULL, 10, true, '2026-10-25 11:41:05.361365+00', '2026-10-25 11:41:05.361365+00');


--
-- Data for Name: news; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.news VALUES (2, 'Quy trình canh tác hữu cơ chuẩn VietGAP tại nông trại VFT Farms Đà Lạt', 'quy-trinh-canh-tac-huu-co-chuan-vietgap-tai-nong-trai-vft-farms-da-lat', 'Khám phá mô hình canh tác tuần hoàn không phân bón hóa học, ứng dụng chế phẩm sinh học vi sinh VFT đạt chuẩn an toàn vệ sinh thực phẩm cao nhất.', '<h2>Nông nghiệp sạch bắt đầu từ đất và nguồn nước</h2><p>Tại nông trại VFT Farms Lâm Đồng, chúng tôi bắt đầu quy trình canh tác với nguồn nước ngầm tự nhiên được kiểm định định kỳ mỗi quý. Đất trồng được cải tạo hoàn toàn bằng phân vi sinh hữu cơ và chế phẩm sinh học VFT trong suốt 18 tháng trước khi gieo vụ đầu tiên.</p><h3>Nói KHÔNG với 4 yếu tố nguy hại</h3><ul><li>Không thuốc trừ sâu hóa học tổng hợp.</li><li>Không phân bón hóa học vô cơ kích thích tăng trưởng.</li><li>Không hạt giống biến đổi gen (Non-GMO).</li><li>Không chất bảo quản sau thu hoạch.</li></ul><p>Mỗi búp xà lách, cây cà chua bi hay bó măng tây được thu hái thủ công vào sáng sớm khi sương đọng, sơ chế trong môi trường làm mát 16°C và vận chuyển ngay trong xe bảo ôn chuyên dụng.</p>', 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=1000&q=80', 'TIN_TRANG_TRAI', true, 265, 1, '2026-10-22 08:43:43.49123+00', '2026-10-22 08:43:43.49123+00');
INSERT INTO public.news VALUES (3, 'Thông báo chính sách giao hàng nhanh 2 giờ cho cư dân nội thành', 'thong-bao-chinh-sach-giao-hang-nhanh-2-gio-cho-cu-dan-noi-thanh', 'VFT Farms chính thức vận hành đội giao vận nông sản chuyên biệt, cam kết giao rau củ tươi hái trong ngày chỉ trong 2 giờ kể từ khi chốt đơn.', '<h2>Nông sản tươi ngon cần tốc độ giao vận tối ưu</h2><p>Nhằm đem đến trải nghiệm thực phẩm tươi mới nhất, VFT Farms chính thức triển khai dịch vụ <strong>Giao hàng hỏa tốc trong 2 giờ</strong> áp dụng cho tất cả đơn hàng đặt trước 16h00 hàng ngày.</p><h3>Chính sách cụ thể</h3><p>Rau củ sau khi thu hái tại vườn được chuyển về kho trung chuyển tại các quận trung tâm. Ngay khi bạn hoàn tất đặt hàng trên website, hệ thống tự động định tuyến kho gần nhất và shipper chuyên dụng sẽ giao tận cửa.</p><p>Đặc biệt: Miễn phí vận chuyển cho tất cả các đơn hàng từ <strong>300.000đ</strong> trở lên!</p>', 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=1000&q=80', 'THONG_BAO', true, 98, 1, '2026-10-22 08:43:43.49123+00', '2026-10-22 08:43:43.49123+00');
INSERT INTO public.news VALUES (4, 'Bí quyết bảo quản rau củ tươi xanh suốt tuần không mất chất dinh dưỡng', 'bi-quyet-bao-quan-rau-cu-tuoi-xanh-suot-tuan-khong-mat-chat-dinh-duong', 'Những mẹo đơn giản giúp các bà nội trợ giữ rau xanh, củ quả luôn giòn ngọt, giữ trọn hàm lượng vitamin và khoáng chất tự nhiên.', '<h2>Nguyên tắc bảo quản rau xanh tươi lâu</h2><p>Rau củ hữu cơ không sử dụng chất bảo quản thường có thời gian giữ độ tươi ngắn hơn so với nông sản thông thường nếu không bảo quản đúng cách.</p><h3>3 Quy tắc vàng bạn cần nhớ</h3><ol><li><strong>Không rửa trước khi cho vào tủ lạnh:</strong> Độ ẩm dư thừa là nguyên nhân hàng đầu khiến lá rau bị úng thối. Hãy để rau khô ráo, chỉ rửa ngay trước khi chế biến.</li><li><strong>Bọc bằng khăn giấy hoặc túi vải:</strong> Khăn giấy sẽ hút bớt độ ẩm thừa nhưng vẫn duy trì độ thoáng khí cần thiết cho rau thở.</li><li><strong>Phân loại thực phẩm sinh khí Ethylene:</strong> Chuối, táo và cà chua chín sản sinh nhiều khí Ethylene làm các loại rau lá xanh nhanh ngả vàng. Cần bảo quản riêng các nhóm quả này.</li></ol>', 'https://images.unsplash.com/photo-1574316071802-0d684efa7cd5?auto=format&fit=crop&w=1000&q=80', 'KIEN_THUC', true, 318, 1, '2026-10-22 08:43:43.49123+00', '2026-10-22 08:43:43.49123+00');
INSERT INTO public.news VALUES (1, 'Hướng dẫn tra cứu nguồn gốc nông sản bằng mật mã học SHA-256', 'huong-dan-tra-cuu-nguon-goc-nong-san-bang-mat-ma-hoc-sha-256', 'Tìm hiểu cách VFT Farms áp dụng công nghệ mật mã học SHA-256 để bảo chứng nguồn gốc từng mẻ rau củ từ nông trại đến bàn ăn người tiêu dùng.', '<h2>Tại sao truy xuất nguồn gốc lại quan trọng?</h2><p>Trong thời đại mà thực phẩm bẩn và không rõ nguồn gốc tràn lan, người tiêu dùng ngày càng quan tâm sâu sắc đến việc thực phẩm họ ăn hàng ngày được trồng ở đâu, dùng phân bón gì và có an toàn không.</p><h3>Công nghệ SHA-256 tại VFT Farms</h3><p>Mỗi lô hàng tại <strong>VFT Farms</strong> đều được tạo một chuỗi mã định danh duy nhất dựa trên giải thuật băm mật mã học SHA-256 (Secure Hash Algorithm 256-bit). Chuỗi hash này được sinh ra từ các trường dữ liệu bất biến: Mã định danh sản phẩm, Tiêu chuẩn VietGAP/Hữu cơ, Nông trại xuất xứ và Mã lô thu hoạch.</p><p>Chỉ cần 1 thông số bị chỉnh sửa, chuỗi hash sẽ hoàn toàn thay đổi. Nhờ đó, người tiêu dùng hoàn toàn yên tâm về tính minh bạch 100% không thể giả mạo.</p><h3>Các bước tra cứu trực tiếp trên website</h3><ul><li><strong>Bước 1:</strong> Truy cập vào chi tiết sản phẩm bất kỳ hoặc đơn hàng của bạn.</li><li><strong>Bước 2:</strong> Bấm nút <em>Nguồn gốc SHA-256</em> hoặc <em>Truy xuất SHA-256</em>.</li><li><strong>Bước 3:</strong> Cửa sổ chứng thư minh bạch sẽ hiển thị đầy đủ thông tin vùng trồng và chuỗi hash đối soát.</li></ul>', 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1000&q=80', 'KIEN_THUC', true, 143, 1, '2026-10-22 08:43:43.49123+00', '2026-10-22 08:43:43.49123+00');
INSERT INTO public.news VALUES (5, 'Ứng dụng men vi sinh VFT Bio trong cải tạo đất phèn mặn', 'ung-dung-men-vi-sinh-vft-bio-trong-cai-tao-dat-phen-man', 'Giải pháp sinh học bền vững giúp hàng ngàn hecta đất canh tác đồng bằng sông Cửu Long hồi sinh màu mỡ.', '<h2>Thực trạng đất phèn mặn tại miền Tây</h2><p>Đất đai bị thoái hóa do biến đổi khí hậu và lạm dụng phân bón vô cơ. Vi sinh vật có ích bị tiêu diệt khiến rễ cây khó hấp thụ dinh dưỡng.</p><h3>Hiệu quả vượt trội của men VFT</h3><p>Công nghệ vi sinh đa chủng VFT giúp phân giải độc tố phèn, cố định đạm tự nhiên và tăng độ tơi xốp cho đất chỉ sau 3 tuần sử dụng.</p>', 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=1000&q=80', 'KIEN_THUC', true, 185, 1, '2026-10-22 09:55:06.479183+00', '2026-10-22 09:55:06.479183+00');
INSERT INTO public.news VALUES (6, 'Khai trương nông trại sinh thái trải nghiệm VFT Eco Farm Tiền Giang', 'khai-truong-nong-trai-sinh-thai-vft-eco-farm-tien-giang', 'Điểm đến lý tưởng cho các gia đình trải nghiệm tự tay thu hoạch dưa lưới, rau quả sạch chuẩn organic vào cuối tuần.', '<h2>Trải nghiệm nông nghiệp xanh thực thụ</h2><p>Với diện tích hơn 15 hecta, VFT Eco Farm Tiền Giang mở cửa đón khách tham quan, học tập mô hình canh tác tuần hoàn không rác thải.</p>', 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=1000&q=80', 'TIN_TRANG_TRAI', true, 420, 1, '2026-10-22 09:55:06.479183+00', '2026-10-22 09:55:06.479183+00');
INSERT INTO public.news VALUES (7, 'Thông báo lịch thu hoạch và trả đơn rau sạch dịp Tết Nguyên Đán 2026', 'thong-bao-lich-thu-hoach-tet-nguyen-dan-2026', 'Chi tiết khung giờ giao nhận và cam kết bình ổn giá toàn bộ mặt hàng rau củ quả trong tuần cao điểm cận Tết.', '<h2>Cam kết bình ổn giá và nguồn cung dồi dào</h2><p>VFT Farms cam kết không tăng giá bất kỳ sản phẩm nào trong dịp Tết, đảm bảo nguồn rau sạch cho mâm cơm gia đình Việt.</p>', 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=1000&q=80', 'THONG_BAO', true, 530, 1, '2026-10-22 09:55:06.479183+00', '2026-10-22 09:55:06.479183+00');
INSERT INTO public.news VALUES (8, 'Lợi ích bất ngờ của nấm mối đen đối với sức khỏe tim mạch và đề kháng', 'loi-ich-bat-ngo-cua-nam-moi-den-doi-voi-suc-khoe', 'Nấm mối đen được mệnh danh là vàng đen trong ẩm thực dưỡng sinh nhờ hàm lượng beta-glucan và khoáng chất dồi dào.', '<h2>Giá trị dinh dưỡng của nấm mối đen</h2><p>Chứa nhiều axit amin thiết yếu, vitamin nhóm B và chất chống oxy hóa giúp hạ cholesterol xấu và tăng cường miễn dịch.</p>', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1000&q=80', 'KIEN_THUC', true, 275, 1, '2026-10-22 09:55:06.479183+00', '2026-10-22 09:55:06.479183+00');
INSERT INTO public.news VALUES (9, 'Gạo ST25 sinh thái VFT Farms đạt chứng nhận Hữu cơ Quốc tế USDA', 'gao-st25-sinh-thai-dat-chung-nhan-usda', 'Thành quả tự hào khẳng định chất lượng hạt gạo Việt Nam trên bản đồ nông sản sạch thế giới.', '<h2>Quy trình kiểm định khắt khe</h2><p>Vượt qua hơn 500 chỉ tiêu về dư lượng thuốc bảo vệ thực vật và kim loại nặng để đạt chứng nhận USDA danh giá.</p>', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=1000&q=80', 'TIN_TRANG_TRAI', true, 610, 1, '2026-10-22 09:55:06.479183+00', '2026-10-22 09:55:06.479183+00');
INSERT INTO public.news VALUES (10, '5 Cách phân biệt cà chua chín tự nhiên và cà chua ủ hóa chất', '5-cach-phan-biet-ca-chua-chin-tu-nhien', 'Mẹo nhận biết cà chua an toàn qua cuống lá, độ mềm và màu sắc hạt bên trong quả.', '<h2>Quan sát cuống và hạt cà chua</h2><p>Cà chua chín tự nhiên cuống luôn tươi xanh bám chặt, ruột quả có hạt màu vàng xanh và lớp thạch trong suốt.</p>', 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=1000&q=80', 'KIEN_THUC', true, 340, 1, '2026-10-22 09:55:06.479183+00', '2026-10-22 09:55:06.479183+00');
INSERT INTO public.news VALUES (11, 'Chương trình Ngày Hội Nông Dân Số: Kết nối chuỗi giá trị nông nghiệp 4.0', 'ngay-hoi-nong-dan-so-ket-noi-chuoi-gia-tri-4-0', 'VFT Farms đồng hành cùng hơn 300 hợp tác xã nông nghiệp ứng dụng mã băm SHA-256 truy xuất nguồn gốc.', '<h2>Chuyển đổi số trong canh tác nông nghiệp</h2><p>Ứng dụng cảm biến IoT theo dõi độ ẩm đất và nhật ký canh tác điện tử minh bạch trên chuỗi khối.</p>', 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=1000&q=80', 'TIN_TRANG_TRAI', true, 195, 1, '2026-10-22 09:55:06.479183+00', '2026-10-22 09:55:06.479183+00');
INSERT INTO public.news VALUES (12, 'Thông báo chính sách ưu đãi thành viên VIP VFT Green Club', 'thong-bao-chinh-sach-vip-vft-green-club', 'Tích điểm đổi quà nông sản, miễn phí vận chuyển trọn năm và ưu tiên giao hỏa tốc cho thành viên thân thiết.', '<h2>Đặc quyền thành viên Green Club</h2><p>Giảm thêm 5% cho mọi hóa đơn và nhận giỏ quà nông sản đặc sản vùng miền mỗi quý.</p>', 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=1000&q=80', 'THONG_BAO', true, 150, 1, '2026-10-22 09:55:06.479183+00', '2026-10-22 09:55:06.479183+00');
INSERT INTO public.news VALUES (13, 'Bảo quản quả bơ sáp 034 đúng cách để không bị thối đầu hay đắng', 'bao-quan-bo-sap-034-dung-cach', 'Cách ủ bơ chín đều tự nhiên bằng khăn ẩm và cách cấp đông bơ dùng cả năm làm sinh tố.', '<h2>Bí quyết ủ bơ chín ngon nhất</h2><p>Không cho bơ vào túi nilon kín. Đặt bơ nơi thoáng mát, lót khăn giấy ẩm để vỏ bơ chín đều từ cuống đến đuôi.</p>', 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=1000&q=80', 'KIEN_THUC', true, 410, 1, '2026-10-22 09:55:06.479183+00', '2026-10-22 09:55:06.479183+00');
INSERT INTO public.news VALUES (14, 'Nâng cấp hệ thống kho lạnh trung tâm tại TP. Hồ Chí Minh lên 500 tấn', 'nang-cap-kho-lanh-trung-tam-tphcm-500-tan', 'Đảm bảo nông sản luôn được bảo quản trong điều kiện tối ưu từ 14 - 18 độ C ngay sau khi rời vườn.', '<h2>Hiện đại hóa chuỗi cung ứng lạnh Cold Chain</h2><p>Trang bị hệ thống kiểm soát nhiệt ẩm tự động 24/7 giúp rau củ giữ nguyên độ tươi ngon khi tới tay người tiêu dùng.</p>', 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1000&q=80', 'TIN_TRANG_TRAI', true, 280, 1, '2026-10-22 09:55:06.479183+00', '2026-10-22 09:55:06.479183+00');
INSERT INTO public.news VALUES (15, 'Hướng dẫn làm phân bón hữu cơ từ rác nhà bếp siêu đơn giản', 'huong-dan-lam-phan-bon-huu-co-tai-nha', 'Tận dụng vỏ rau củ quả thừa ủ cùng men vi sinh VFT để bón cây ban công xanh mướt.', '<h2>Quy trình ủ phân không mùi hôi</h2><p>Sử dụng thùng xốp có lỗ thoát khí, bổ sung men Trichoderma VFT để phân hủy rác hữu cơ chỉ trong 15 ngày.</p>', 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=1000&q=80', 'KIEN_THUC', true, 365, 1, '2026-10-22 09:55:06.479183+00', '2026-10-22 09:55:06.479183+00');
INSERT INTO public.news VALUES (17, 'Tại sao nên ăn rau củ quả đúng mùa vụ tự nhiên?', 'tai-sao-nen-an-rau-cu-dung-mua-vu', 'Những giá trị dinh dưỡng cao nhất và hạn chế tối đa nguy cơ tồn dư hóa chất khi lựa chọn nông sản thuận tự nhiên.', '<h2>Thuận tự nhiên là bài thuốc tốt nhất</h2><p>Rau củ chính vụ sinh trưởng trong điều kiện khí hậu phù hợp nhất nên tích lũy nhiều vitamin và khoáng chất tự nhiên nhất.</p>', 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?auto=format&fit=crop&w=1000&q=80', 'KIEN_THUC', true, 290, 1, '2026-10-22 09:55:06.479183+00', '2026-10-22 09:55:06.479183+00');
INSERT INTO public.news VALUES (18, 'VFT Farms tài trợ 1000 cây giống bản địa cho dự án phủ xanh đồi trọc Tây Bắc', 'vft-farms-tai-tro-1000-cay-giong-tay-bac', 'Hành động thiết thực bảo vệ môi trường sinh thái và tạo sinh kế bền vững cho đồng bào vùng cao.', '<h2>Trách nhiệm xã hội vì một Việt Nam xanh</h2><p>Chuyến đi ý nghĩa của cán bộ nhân viên VFT Farms kết hợp trao tặng cây giống bản địa và chuyển giao kỹ thuật ủ phân sinh học.</p>', 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=1000&q=80', 'TIN_TRANG_TRAI', true, 480, 1, '2026-10-22 09:55:06.479183+00', '2026-10-22 09:55:06.479183+00');
INSERT INTO public.news VALUES (31, 'Kỹ thuật trồng rau xà lách thủy canh hồi lưu tại nông trại Đơn Dương', 'ky-thuat-trong-xa-lach-thuy-canh-hoi-luu', 'Tìm hiểu quy trình kiểm soát dinh dưỡng tự động bằng cảm biến EC và pH hiện đại.', '<p>Hệ thống thủy canh hồi lưu tuần hoàn giúp tiết kiệm 80% lượng nước và đảm bảo rau sạch 100% không nhiễm kim loại nặng.</p>', 'https://images.unsplash.com/photo-1594282486552-05b4d80fec9f?auto=format&fit=crop&w=1000&q=80', 'TIN_TRANG_TRAI', true, 411, 1, '2026-10-22 09:58:25.549538+00', '2026-10-26 06:25:11.983178+00');
INSERT INTO public.news VALUES (19, 'Cảnh giác chiêu trò mạo danh thương hiệu VFT Farms bán hàng kém chất lượng', 'canh-giac-mao-danh-thuong-hieu-vft-farms', 'Khuyến cáo quý khách hàng chỉ mua hàng qua website chính thức và quét mã SHA-256 để kiểm định.', '<h2>Cách nhận biết kênh phân phối chính thức</h2><p>Mọi sản phẩm VFT Farms đều có hóa đơn mã đơn #ORD-... và mã xác thực nguồn gốc mật mã học SHA-256 duy nhất.</p>', 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=1000&q=80', 'THONG_BAO', true, 520, 1, '2026-10-22 09:55:06.479183+00', '2026-10-22 09:55:06.479183+00');
INSERT INTO public.news VALUES (20, 'Nước ép cần tây: Uống sao cho đúng cách để thải độc và sáng da', 'nuoc-ep-can-tay-dung-cach-thai-doc', 'Liều lượng phù hợp và thời điểm vàng trong ngày giúp cơ thể hấp thu trọn vẹn chất chống oxy hóa từ cần tây.', '<h2>Uống vào buổi sáng khi bụng đói</h2><p>Một ly 250ml nước ép cần tây nguyên chất trước bữa ăn sáng 30 phút giúp kích thích nhu động ruột và cân bằng điện giải.</p>', 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=1000&q=80', 'KIEN_THUC', true, 460, 1, '2026-10-22 09:55:06.479183+00', '2026-10-22 09:55:06.479183+00');
INSERT INTO public.news VALUES (21, 'Mô hình nuôi trùn quế xử lý phụ phẩm nông nghiệp khép kín tại VFT', 'mo-hinh-nuoi-trun-que-khep-kin-tai-vft', 'Cách VFT Farms biến toàn bộ vỏ rau củ quả thải loại thành phân trùn quế giàu dinh dưỡng cho vụ mùa sau.', '<h2>Kinh tế tuần hoàn trong nông nghiệp</h2><p>Không có gì bị vứt bỏ. Phân trùn quế giúp cây trồng tăng sức đề kháng tự nhiên với nấm bệnh trong đất.</p>', 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=1000&q=80', 'TIN_TRANG_TRAI', true, 215, 1, '2026-10-22 09:55:06.479183+00', '2026-10-22 09:55:06.479183+00');
INSERT INTO public.news VALUES (22, 'Thông báo nâng cấp tổng đài hỗ trợ khách hàng miễn phí 1800 6868', 'thong-bao-nang-cap-tong-dai-mien-phi-1800-6868', 'Kênh hỗ trợ giải đáp khiếu nại, tư vấn dinh dưỡng và chăm sóc đơn hàng hoạt động liên tục từ 7h00 đến 21h00.', '<h2>Nâng cao chất lượng phục vụ khách hàng</h2><p>Tổng đài miễn hoàn toàn cước gọi cho người dùng trên toàn quốc, kết nối trực tiếp với chuyên viên tư vấn.</p>', 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=1000&q=80', 'THONG_BAO', true, 175, 1, '2026-10-22 09:55:06.479183+00', '2026-10-22 09:55:06.479183+00');
INSERT INTO public.news VALUES (23, 'Tự trồng rau mầm tại nhà: Thu hoạch sau 5 ngày siêu dễ', 'tu-trong-rau-mam-tai-nha-5-ngay', 'Hướng dẫn chi tiết từ khâu ngâm hạt, chuẩn bị giá thể xơ dừa đến cách tưới ẩm cho rau mầm xanh mướt.', '<h2>Rau mầm củ cải trắng và hướng dương</h2><p>Hàm lượng dinh dưỡng trong rau mầm cao gấp 5 lần rau trưởng thành. Thích hợp cho các bữa ăn healthy tại nhà.</p>', 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?auto=format&fit=crop&w=1000&q=80', 'KIEN_THUC', true, 395, 1, '2026-10-22 09:55:06.479183+00', '2026-10-22 09:55:06.479183+00');
INSERT INTO public.news VALUES (24, 'Đoàn chuyên gia Nông nghiệp Nhật Bản tham quan mô hình VietGAP VFT Farms', 'doan-chuyen-gia-nhat-ban-tham-quan-vft-farms', 'Đánh giá cao hệ thống truy xuất nguồn gốc SHA-256 và mở ra cơ hội xuất khẩu nông sản sạch sang thị trường Tokyo.', '<h2>Đạt chuẩn chất lượng xuất khẩu</h2><p>Các chuyên gia đánh giá cao tính minh bạch và độ ngọt tự nhiên của dưa lưới Huỳnh Long và ớt chuông Đà Lạt.</p>', 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=1000&q=80', 'TIN_TRANG_TRAI', true, 580, 1, '2026-10-22 09:55:06.479183+00', '2026-10-22 09:55:06.479183+00');
INSERT INTO public.news VALUES (25, 'Kế hoạch khảo sát mở rộng vùng trồng dược liệu quý tại Sa Pa (Bản nháp)', 'ke-hoach-khao-sat-vung-trong-sa-pa-draft', 'Nội dung dự thảo chiến lược phát triển cây thuốc bản địa và hợp tác cùng bà con dân tộc thiểu số Tây Bắc.', '<h2>Dự thảo chiến lược nội bộ</h2><p>Đang trong quá trình khảo sát thực địa thổ nhưỡng và khí hậu vùng núi Hoàng Liên Sơn.</p>', 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1000&q=80', 'TIN_TRANG_TRAI', false, 15, 1, '2026-10-22 09:55:06.479183+00', '2026-10-22 09:55:06.479183+00');
INSERT INTO public.news VALUES (26, 'Nghiên cứu ứng dụng công nghệ enzym sinh học trong khử khuẩn rau quả (Bản nháp)', 'nghien-cuu-ung-dung-enzym-sinh-hoc-draft', 'Tài liệu kỹ thuật nội bộ về giải pháp rửa rau bằng nước ion kiềm và enzym lên men từ dứa.', '<h2>Tài liệu nghiên cứu R&D</h2><p>Thử nghiệm trong phòng thí nghiệm cho thấy hiệu quả tiêu diệt vi khuẩn E.coli và Salmonella lên tới 99.8% mà không làm dập nát tế bào lá rau.</p>', 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=1000&q=80', 'KIEN_THUC', false, 28, 1, '2026-10-22 09:55:06.479183+00', '2026-10-22 09:55:06.479183+00');
INSERT INTO public.news VALUES (27, 'Dự thảo quy chế thưởng dành cho Nhân viên Giao vận xuất sắc quý I (Bản nháp)', 'du-thao-quy-che-thuong-giao-van-draft', 'Bảng tiêu chí đánh giá tỷ lệ giao đúng giờ và tỷ lệ chụp ảnh làm chứng đơn hàng đạt chuẩn.', '<h2>Nội dung lưu hành nội bộ</h2><p>Khen thưởng các cá nhân đạt điểm đánh giá 5 sao từ khách hàng và tỷ lệ hoàn tất đơn hàng đạt 100%.</p>', 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1000&q=80', 'THONG_BAO', false, 8, 1, '2026-10-22 09:55:06.479183+00', '2026-10-22 09:55:06.479183+00');
INSERT INTO public.news VALUES (16, 'Thông báo tuyển dụng Kỹ sư Nông nghiệp Công nghệ cao làm việc tại Đà Lạt', 'thong-bao-tuyen-dung-ky-su-nong-nghiep-da-lat', 'Gia nhập đội ngũ nghiên cứu và phát triển mô hình nhà kính tự động hóa tại VFT Farms Lâm Đồng.', '<h2>Môi trường làm việc chuyên nghiệp</h2><p>Chế độ đãi ngộ hấp dẫn, cơ hội tham gia các dự án hợp tác nông nghiệp sạch cùng đối tác Israel và Nhật Bản.</p>', 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=1000&q=80', 'THONG_BAO', true, 111, 1, '2026-10-22 09:55:06.479183+00', '2026-10-22 09:55:06.479183+00');
INSERT INTO public.news VALUES (29, 'Lợi ích của việc ăn thực phẩm hữu cơ đối với hệ vi sinh đường ruột', 'loi-ich-thuc-pham-huu-co-he-vi-sinh', 'Nghiên cứu mới chỉ ra rau củ không hóa chất bảo vệ niêm mạc ruột và tăng cường miễn dịch.', '<p>Thực phẩm hữu cơ cung cấp chất xơ tự nhiên và các chất chống oxy hóa dồi dào, giúp nuôi dưỡng lợi khuẩn trong đường tiêu hóa.</p>', 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1000&q=80', 'KIEN_THUC', true, 280, 1, '2026-10-22 09:58:25.549538+00', '2026-10-22 09:58:25.549538+00');
INSERT INTO public.news VALUES (30, 'Thông báo chính sách hỗ trợ đổi trả rau hỏng trong vòng 24 giờ', 'thong-bao-chinh-sach-doi-tra-rau-24h', 'Cam kết 1 đổi 1 hoặc hoàn tiền ngay lập tức nếu nông sản bị dập nát do vận chuyển.', '<p>VFT Farms luôn đặt trải nghiệm và sự an tâm của khách hàng lên hàng đầu với chính sách đổi trả nhanh chóng qua Zalo hoặc Hotline.</p>', 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1000&q=80', 'THONG_BAO', true, 196, 1, '2026-10-22 09:58:25.549538+00', '2026-10-22 09:58:25.549538+00');
INSERT INTO public.news VALUES (34, 'VFT Farms triển khai chương trình Tích điểm Nông nghiệp xanh 2026', 'vft-farms-chuong-trinh-tich-diem-xanh-2026', 'Mỗi đơn hàng thành công quy đổi điểm tích lũy thành voucher giảm giá và cây giống.', '<p>Chương trình tri ân khách hàng thân thiết với nhiều ưu đãi đặc biệt dành cho hạng thành viên Vàng và Kim Cương.</p>', 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1000&q=80', 'THONG_BAO', true, 180, 1, '2026-10-22 09:58:25.549538+00', '2026-10-22 09:58:25.549538+00');
INSERT INTO public.news VALUES (35, 'Mô hình tuần hoàn rác hữu cơ thành đất vi sinh tại VFT Farm Củ Chi', 'mo-hinh-tuan-hoan-rac-huu-co-thanh-dat-vi-sinh', 'Phụ phẩm nông nghiệp được ủ men vi sinh VFT Bio thành phân bón hữu cơ chất lượng cao.', '<p>Không có rác thải nông nghiệp bị bỏ đi tại trang trại VFT, tất cả đều quay trở lại làm giàu cho đất và nuôi sống cây trồng.</p>', 'https://images.unsplash.com/photo-1618164436241-4473940d1f5c?auto=format&fit=crop&w=1000&q=80', 'TIN_TRANG_TRAI', true, 390, 1, '2026-10-22 09:58:25.549538+00', '2026-10-22 09:58:25.549538+00');
INSERT INTO public.news VALUES (36, 'Top 7 loại rau củ giàu sắt và vitamin C bổ máu cho mẹ bầu', 'top-7-rau-cu-giau-sat-vitamin-c-cho-me-bau', 'Cải bó xôi, củ dền, bí đỏ và măng tây là những lựa chọn vàng cho dinh dưỡng thai kỳ.', '<p>Rau xanh lá đậm kết hợp cùng vitamin C tự nhiên từ ớt chuông giúp cơ thể hấp thu sắt tối đa mà không gây táo bón.</p>', 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=1000&q=80', 'KIEN_THUC', true, 510, 1, '2026-10-22 09:58:25.549538+00', '2026-10-22 09:58:25.549538+00');
INSERT INTO public.news VALUES (37, 'Thông báo bảo trì máy chủ đồng bộ dữ liệu hóa đơn điện tử', 'thong-bao-bao-tri-may-chu-dong-bo-hoa-don', 'Hệ thống tiến hành nâng cấp hạ tầng mạng trong khung giờ 00h - 02h sáng ngày 25/10.', '<p>Các giao dịch đặt hàng vẫn diễn ra bình thường, hệ thống hóa đơn điện tử sẽ tự động gửi email sau khi bảo trì hoàn tất.</p>', 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1000&q=80', 'THONG_BAO', false, 45, 1, '2026-10-22 09:58:25.549538+00', '2026-10-22 09:58:25.549538+00');
INSERT INTO public.news VALUES (38, 'Kinh nghiệm chọn cam sành mọng nước, vỏ mỏng, ngọt thanh', 'kinh-nghiem-chon-cam-sanh-mong-nuoc', 'Bí quyết quan sát núm cuống, độ bóng của vỏ và đáy trái cam sành Hàm Yên.', '<p>Cam sành chín cây tự nhiên có vỏ ngả vàng nhẹ ở phần đáy, cầm nặng tay và cuống lá còn xanh tươi.</p>', 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=1000&q=80', 'KIEN_THUC', true, 275, 1, '2026-10-22 09:58:25.549538+00', '2026-10-22 09:58:25.549538+00');
INSERT INTO public.news VALUES (39, 'VFT Farms đón đoàn sinh viên Đại học Nông Lâm TP.HCM thực tập', 'vft-farms-don-sinh-vien-nong-lam-thuc-tap', 'Chương trình đào tạo thực tế về quản trị chuỗi cung ứng thực phẩm an toàn.', '<p>Các bạn sinh viên được trực tiếp tham gia quy trình kiểm tra chất lượng, đóng gói phòng lạnh và vận hành hệ thống truy xuất SHA-256.</p>', 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1000&q=80', 'TIN_TRANG_TRAI', true, 220, 1, '2026-10-22 09:58:25.549538+00', '2026-10-22 09:58:25.549538+00');
INSERT INTO public.news VALUES (41, 'Thông báo điều chỉnh phí giao hàng hỏa tốc khu vực ngoại thành', 'thong-bao-dieu-chinh-phi-giao-hang-hoa-toc', 'Cập nhật bảng giá cước vận chuyển linh hoạt theo từng quận huyện từ 01/11/2026.', '<p>Áp dụng chính sách hỗ trợ phí ship 50% cho tất cả đơn hàng nông sản có giá trị từ 300.000đ.</p>', 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1000&q=80', 'THONG_BAO', true, 160, 1, '2026-10-22 09:58:25.549538+00', '2026-10-22 09:58:25.549538+00');
INSERT INTO public.news VALUES (42, 'Tác dụng kỳ diệu của củ dền đỏ đối với huyết áp và tim mạch', 'tac-dung-cu-den-do-doi-voi-huyet-ap', 'Hợp chất nitrat tự nhiên trong củ dền giúp giãn mạch máu và tăng lưu thông khí huyết.', '<p>Một ly nước ép củ dền kết hợp cà rốt mỗi sáng mang lại năng lượng bền bỉ và bảo vệ trái tim khỏe mạnh.</p>', 'https://images.unsplash.com/photo-1593105544559-ecb03bf76f82?auto=format&fit=crop&w=1000&q=80', 'KIEN_THUC', true, 335, 1, '2026-10-22 09:58:25.549538+00', '2026-10-22 09:58:25.549538+00');
INSERT INTO public.news VALUES (43, 'VFT Farms mở thêm điểm phân phối nông sản sạch tại Quận 7', 'vft-farms-mo-diem-phan-phoi-quan-7', 'Không gian trải nghiệm mua sắm nông sản hữu cơ tươi ngon cho cư dân khu đô thị Phú Mỹ Hưng.', '<p>Cửa hàng mới được trang bị hệ thống phun sương tạo ẩm hiện đại giúp rau củ luôn giữ được độ tươi giòn suốt cả ngày.</p>', 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1000&q=80', 'TIN_TRANG_TRAI', true, 480, 1, '2026-10-22 09:58:25.549538+00', '2026-10-22 09:58:25.549538+00');
INSERT INTO public.news VALUES (44, 'Bí quyết làm sốt dấm táo lên men thanh đạm trộn salad', 'bi-quyet-lam-sot-dam-tao-len-men-salad', 'Công thức sốt dấm táo hữu cơ thơm ngon, ít calo cho thực đơn eat clean mỗi ngày.', '<p>Dấm táo kết hợp dầu mè nguyên chất ép lạnh và một chút mật ong rừng tạo nên hương vị chua ngọt quyến rũ.</p>', 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1000&q=80', 'KIEN_THUC', true, 290, 1, '2026-10-22 09:58:25.549538+00', '2026-10-22 09:58:25.549538+00');
INSERT INTO public.news VALUES (45, 'Gạo lứt huyết rồng Điện Biên: Giá trị dinh dưỡng cho người tiểu đường', 'gao-lut-huyet-rong-dien-bien-dinh-duong', 'Chỉ số đường huyết thấp cùng hàm lượng chất xơ cao giúp ổn định đường huyết sau bữa ăn.', '<p>Gạo lứt đỏ nương Điện Biên thơm bùi tự nhiên, thích hợp nấu cơm hoặc làm trà gạo lứt thanh lọc cơ thể.</p>', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=1000&q=80', 'KIEN_THUC', true, 370, 1, '2026-10-22 09:58:25.549538+00', '2026-10-22 09:58:25.549538+00');
INSERT INTO public.news VALUES (46, 'Thông báo tuyển dụng Kỹ sư Nông nghiệp công nghệ cao đợt 2/2026', 'thong-bao-tuyen-dung-ky-su-nong-nghiep-2026', 'Cơ hội làm việc tại hệ thống nhà màng thông minh VFT Farms với đãi ngộ hấp dẫn.', '<p>VFT Farms chào đón các ứng viên đam mê nông nghiệp bền vững, có kinh nghiệm vận hành hệ thống tưới tự động.</p>', 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1000&q=80', 'THONG_BAO', true, 140, 1, '2026-10-22 09:58:25.549538+00', '2026-10-22 09:58:25.549538+00');
INSERT INTO public.news VALUES (40, 'Tại sao mật ong hoa bạc hà Mèo Vạc lại có màu vàng chanh óng ả?', 'tai-sao-mat-ong-bac-ha-meo-vac-mau-vang-chanh', 'Tìm hiểu về loài hoa bạc hà mọc hoang dại trên cao nguyên đá Đồng Văn.', '<p>Mùi hương thơm thanh mát đặc trưng cùng vị ngọt dịu tạo nên giá trị dinh dưỡng và thương hiệu của mật ong bạc hà Hà Giang.</p>', 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=1000&q=80', 'KIEN_THUC', true, 311, 1, '2026-10-22 09:58:25.549538+00', '2026-10-22 09:58:25.549538+00');
INSERT INTO public.news VALUES (47, 'Kỹ thuật trồng nấm mối đen trong môi trường phòng lạnh vô trùng', 'ky-thuat-trong-nam-moi-den-phong-lanh', 'Quy trình sản xuất khép kín mang lại loại nấm dược liệu thơm giòn thượng hạng.', '<p>Nấm mối đen đòi hỏi kiểm soát độ ẩm 90% và nhiệt độ 24-26 độ C liên tục trong suốt 75 ngày sinh trưởng.</p>', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1000&q=80', 'TIN_TRANG_TRAI', true, 425, 1, '2026-10-22 09:58:25.549538+00', '2026-10-22 09:58:25.549538+00');
INSERT INTO public.news VALUES (48, 'Cách phân biệt đậu đen xanh lòng thuần chủng và đậu đen thường', 'phan-biet-dau-den-xanh-long-thuan-chung', 'Hạt nhỏ, ruột màu xanh cốm sáng và mùi thơm đặc trưng khi rang nấu.', '<p>Đậu đen xanh lòng giàu anthocyanin và chất chống oxy hóa vượt trội so với các giống đậu đen lai thông thường.</p>', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1000&q=80', 'KIEN_THUC', true, 255, 1, '2026-10-22 09:58:25.549538+00', '2026-10-22 09:58:25.549538+00');
INSERT INTO public.news VALUES (49, 'Chương trình Ngày hội Nông sản cuối tuần: Giảm 20% toàn bộ rau củ', 'ngay-hoi-nong-san-cuoi-tuan-giam-20', 'Ưu đãi đặc biệt áp dụng từ thứ Sáu đến Chủ Nhật tại tất cả cửa hàng và kênh online.', '<p>Cơ hội tuyệt vời để các gia đình tích trữ thực phẩm sạch đạt chuẩn VietGAP cho bữa cơm sum vầy cuối tuần.</p>', 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1000&q=80', 'THONG_BAO', true, 310, 1, '2026-10-22 09:58:25.549538+00', '2026-10-22 09:58:25.549538+00');
INSERT INTO public.news VALUES (50, 'VFT Farms vinh dự nhận giải thưởng Doanh nghiệp Nông nghiệp Xanh 2026', 'vft-farms-giai-thuong-doanh-nghiep-xanh-2026', 'Ghi nhận những đóng góp tích cực cho chuỗi cung ứng thực phẩm sạch không phát thải rác.', '<p>Giải thưởng là động lực to lớn để VFT Farms tiếp tục mở rộng quy mô sản xuất và đồng hành cùng người tiêu dùng Việt.</p>', 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1000&q=80', 'TIN_TRANG_TRAI', true, 580, 1, '2026-10-22 09:58:25.549538+00', '2026-10-22 09:58:25.549538+00');
INSERT INTO public.news VALUES (51, 'Bí quyết chế biến măng tây xanh xào tỏi giòn ngọt giữ trọn dinh dưỡng', 'bi-quyet-che-bien-mang-tay-xanh-xao-toi', 'Thời gian xào lửa lớn không quá 3 phút giúp măng tây xanh bóng, ngọt lịm.', '<p>Măng tây xanh chứa nhiều axit folic và chất xơ hòa tan, là món ăn bổ dưỡng thích hợp cho cả trẻ nhỏ và người lớn tuổi.</p>', 'https://images.unsplash.com/photo-1515471204630-e60780ebd199?auto=format&fit=crop&w=1000&q=80', 'KIEN_THUC', true, 340, 1, '2026-10-22 09:58:25.549538+00', '2026-10-22 09:58:25.549538+00');
INSERT INTO public.news VALUES (52, 'Thông báo lịch nghỉ Lễ Quốc khánh và thời gian giao hàng bù', 'thong-bao-lich-nghi-le-quoc-khanh-giao-hang', 'VFT Farms phục vụ giao hàng xuyên suốt kỳ nghỉ lễ cho các đơn đặt trước 24 giờ.', '<p>Đội ngũ giao hàng VFT Farms cam kết giao rau củ tươi mới mỗi ngày đến tận tay khách hàng trong dịp lễ.</p>', 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1000&q=80', 'THONG_BAO', false, 88, 1, '2026-10-22 09:58:25.549538+00', '2026-10-22 09:58:25.549538+00');
INSERT INTO public.news VALUES (32, 'Khám phá vườn bưởi da xanh ruột hồng hữu cơ tại Bến Tre', 'kham-pha-vuon-buoi-da-xanh-ben-tre', 'Tận mắt chứng kiến những gốc bưởi sai trĩu cành được nuôi dưỡng bằng phân trùn quế.', '<p>Vườn bưởi VFT Bến Tre áp dụng kỹ thuật tỉa cành tạo tán và bao trái sinh học từ lúc trái còn nhỏ để phòng ngừa sâu bệnh.</p>', 'https://images.unsplash.com/photo-1557800636-894a64c1696f?auto=format&fit=crop&w=1000&q=80', 'TIN_TRANG_TRAI', true, 321, 1, '2026-10-22 09:58:25.549538+00', '2026-10-22 09:58:25.549538+00');
INSERT INTO public.news VALUES (33, 'Cách bảo quản các loại nấm tươi không bị thâm đen và chảy nhớt', 'cach-bao-quan-nam-tuoi-khong-bi-tham-den', 'Mẹo vặt đơn giản từ chuyên gia nông nghiệp giúp nấm bào ngư và nấm mối giữ độ giòn.', '<p>Nấm sau khi mua về không nên rửa nước trước khi cất tủ lạnh. Bọc trong túi giấy thoáng khí giúp nấm tươi ngon từ 5 đến 7 ngày.</p>', 'https://images.unsplash.com/photo-1509358271058-9d163da89611?auto=format&fit=crop&w=1000&q=80', 'KIEN_THUC', true, 261, 1, '2026-10-22 09:58:25.549538+00', '2026-10-22 09:58:25.549538+00');
INSERT INTO public.news VALUES (28, 'Hướng dẫn chi tiết cách tra cứu nguồn gốc SHA-256 trên tem nhãn VFT', 'huong-dan-tra-cuu-sha256-tem-nhan-vft', 'Các bước quét mã QR và xác thực chuỗi khối minh bạch nguồn gốc nông sản an toàn.', '<p>Mỗi kiện hàng của VFT Farms đều được cấp mã băm SHA-256 duy nhất đại diện cho lô thu hoạch, nhật ký bón phân và kết quả kiểm nghiệm tồn dư thuốc BVTV.</p>', 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1000&q=80', 'KIEN_THUC', true, 343, 1, '2026-10-22 09:58:25.549538+00', '2026-10-22 09:58:25.549538+00');


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.order_items VALUES (38, 19, NULL, 'Xà Lách Mỡ Butterhead Thủy Canh', 39000.00, 2.00, 78000.00, '2026-10-22 09:55:06.473515+00');
INSERT INTO public.order_items VALUES (40, 20, NULL, 'Xà Lách Mỡ Butterhead Thủy Canh', 39000.00, 2.00, 78000.00, '2026-10-22 09:55:06.473515+00');
INSERT INTO public.order_items VALUES (42, 21, NULL, 'Xà Lách Mỡ Butterhead Thủy Canh', 39000.00, 2.00, 78000.00, '2026-10-22 09:55:06.473515+00');
INSERT INTO public.order_items VALUES (44, 22, NULL, 'Xà Lách Mỡ Butterhead Thủy Canh', 39000.00, 2.00, 78000.00, '2026-10-22 09:55:06.473515+00');
INSERT INTO public.order_items VALUES (46, 23, NULL, 'Xà Lách Mỡ Butterhead Thủy Canh', 39000.00, 2.00, 78000.00, '2026-10-22 09:55:06.473515+00');
INSERT INTO public.order_items VALUES (48, 24, NULL, 'Xà Lách Mỡ Butterhead Thủy Canh', 39000.00, 2.00, 78000.00, '2026-10-22 09:55:06.473515+00');
INSERT INTO public.order_items VALUES (50, 25, NULL, 'Xà Lách Mỡ Butterhead Thủy Canh', 39000.00, 2.00, 78000.00, '2026-10-22 09:55:06.473515+00');
INSERT INTO public.order_items VALUES (52, 26, NULL, 'Xà Lách Mỡ Butterhead Thủy Canh', 39000.00, 2.00, 78000.00, '2026-10-22 09:55:06.473515+00');
INSERT INTO public.order_items VALUES (54, 27, NULL, 'Xà Lách Mỡ Butterhead Thủy Canh', 39000.00, 2.00, 78000.00, '2026-10-22 09:55:06.473515+00');
INSERT INTO public.order_items VALUES (56, 28, NULL, 'Xà Lách Mỡ Butterhead Thủy Canh', 39000.00, 2.00, 78000.00, '2026-10-22 09:55:06.473515+00');
INSERT INTO public.order_items VALUES (58, 29, NULL, 'Xà Lách Mỡ Butterhead Thủy Canh', 39000.00, 2.00, 78000.00, '2026-10-22 09:55:06.473515+00');
INSERT INTO public.order_items VALUES (60, 30, NULL, 'Xà Lách Mỡ Butterhead Thủy Canh', 39000.00, 2.00, 78000.00, '2026-10-22 09:55:06.473515+00');
INSERT INTO public.order_items VALUES (62, 31, NULL, 'Xà Lách Mỡ Butterhead Thủy Canh', 39000.00, 2.00, 78000.00, '2026-10-22 09:55:06.473515+00');
INSERT INTO public.order_items VALUES (1, 1, NULL, 'Cải Thìa Bạch Ngọc', 25000.00, 2.00, 50000.00, '2026-10-22 09:55:06.473515+00');
INSERT INTO public.order_items VALUES (3, 2, NULL, 'Cải Thìa Bạch Ngọc', 25000.00, 2.00, 50000.00, '2026-10-22 09:55:06.473515+00');
INSERT INTO public.order_items VALUES (5, 3, NULL, 'Cải Thìa Bạch Ngọc', 25000.00, 2.00, 50000.00, '2026-10-22 09:55:06.473515+00');
INSERT INTO public.order_items VALUES (7, 4, NULL, 'Cải Thìa Bạch Ngọc', 25000.00, 2.00, 50000.00, '2026-10-22 09:55:06.473515+00');
INSERT INTO public.order_items VALUES (9, 5, NULL, 'Cải Thìa Bạch Ngọc', 25000.00, 2.00, 50000.00, '2026-10-22 09:55:06.473515+00');
INSERT INTO public.order_items VALUES (11, 6, NULL, 'Cải Thìa Bạch Ngọc', 25000.00, 2.00, 50000.00, '2026-10-22 09:55:06.473515+00');
INSERT INTO public.order_items VALUES (13, 7, NULL, 'Cải Thìa Bạch Ngọc', 25000.00, 2.00, 50000.00, '2026-10-22 09:55:06.473515+00');
INSERT INTO public.order_items VALUES (15, 8, NULL, 'Cải Thìa Bạch Ngọc', 25000.00, 2.00, 50000.00, '2026-10-22 09:55:06.473515+00');
INSERT INTO public.order_items VALUES (17, 9, NULL, 'Cải Thìa Bạch Ngọc', 25000.00, 2.00, 50000.00, '2026-10-22 09:55:06.473515+00');
INSERT INTO public.order_items VALUES (19, 10, NULL, 'Cải Thìa Bạch Ngọc', 25000.00, 2.00, 50000.00, '2026-10-22 09:55:06.473515+00');
INSERT INTO public.order_items VALUES (21, 11, NULL, 'Cải Thìa Bạch Ngọc', 25000.00, 2.00, 50000.00, '2026-10-22 09:55:06.473515+00');
INSERT INTO public.order_items VALUES (23, 12, NULL, 'Cải Thìa Bạch Ngọc', 25000.00, 2.00, 50000.00, '2026-10-22 09:55:06.473515+00');
INSERT INTO public.order_items VALUES (25, 13, NULL, 'Cải Thìa Bạch Ngọc', 25000.00, 2.00, 50000.00, '2026-10-22 09:55:06.473515+00');
INSERT INTO public.order_items VALUES (27, 14, NULL, 'Cải Thìa Bạch Ngọc', 25000.00, 2.00, 50000.00, '2026-10-22 09:55:06.473515+00');
INSERT INTO public.order_items VALUES (29, 15, NULL, 'Cải Thìa Bạch Ngọc', 25000.00, 2.00, 50000.00, '2026-10-22 09:55:06.473515+00');
INSERT INTO public.order_items VALUES (31, 16, NULL, 'Cải Thìa Bạch Ngọc', 25000.00, 2.00, 50000.00, '2026-10-22 09:55:06.473515+00');
INSERT INTO public.order_items VALUES (33, 17, NULL, 'Cải Thìa Bạch Ngọc', 25000.00, 2.00, 50000.00, '2026-10-22 09:55:06.473515+00');
INSERT INTO public.order_items VALUES (35, 18, NULL, 'Cải Thìa Bạch Ngọc', 25000.00, 2.00, 50000.00, '2026-10-22 09:55:06.473515+00');
INSERT INTO public.order_items VALUES (37, 19, NULL, 'Cải Thìa Bạch Ngọc', 25000.00, 2.00, 50000.00, '2026-10-22 09:55:06.473515+00');
INSERT INTO public.order_items VALUES (39, 20, NULL, 'Cải Thìa Bạch Ngọc', 25000.00, 2.00, 50000.00, '2026-10-22 09:55:06.473515+00');
INSERT INTO public.order_items VALUES (41, 21, NULL, 'Cải Thìa Bạch Ngọc', 25000.00, 2.00, 50000.00, '2026-10-22 09:55:06.473515+00');
INSERT INTO public.order_items VALUES (43, 22, NULL, 'Cải Thìa Bạch Ngọc', 25000.00, 2.00, 50000.00, '2026-10-22 09:55:06.473515+00');
INSERT INTO public.order_items VALUES (45, 23, NULL, 'Cải Thìa Bạch Ngọc', 25000.00, 2.00, 50000.00, '2026-10-22 09:55:06.473515+00');
INSERT INTO public.order_items VALUES (47, 24, NULL, 'Cải Thìa Bạch Ngọc', 25000.00, 2.00, 50000.00, '2026-10-22 09:55:06.473515+00');
INSERT INTO public.order_items VALUES (49, 25, NULL, 'Cải Thìa Bạch Ngọc', 25000.00, 2.00, 50000.00, '2026-10-22 09:55:06.473515+00');
INSERT INTO public.order_items VALUES (51, 26, NULL, 'Cải Thìa Bạch Ngọc', 25000.00, 2.00, 50000.00, '2026-10-22 09:55:06.473515+00');
INSERT INTO public.order_items VALUES (53, 27, NULL, 'Cải Thìa Bạch Ngọc', 25000.00, 2.00, 50000.00, '2026-10-22 09:55:06.473515+00');
INSERT INTO public.order_items VALUES (55, 28, NULL, 'Cải Thìa Bạch Ngọc', 25000.00, 2.00, 50000.00, '2026-10-22 09:55:06.473515+00');
INSERT INTO public.order_items VALUES (57, 29, NULL, 'Cải Thìa Bạch Ngọc', 25000.00, 2.00, 50000.00, '2026-10-22 09:55:06.473515+00');
INSERT INTO public.order_items VALUES (59, 30, NULL, 'Cải Thìa Bạch Ngọc', 25000.00, 2.00, 50000.00, '2026-10-22 09:55:06.473515+00');
INSERT INTO public.order_items VALUES (61, 31, NULL, 'Cải Thìa Bạch Ngọc', 25000.00, 2.00, 50000.00, '2026-10-22 09:55:06.473515+00');
INSERT INTO public.order_items VALUES (101, 51, 1, 'Bắp Cải VietGAP Đà Lạt', 30000.00, 1.00, 30000.00, '2026-10-26 06:27:27.704247+00');
INSERT INTO public.order_items VALUES (102, 51, 7, 'Cải Bó Xôi Chân Vịt (Spinach)', 32000.00, 1.00, 32000.00, '2026-10-26 06:27:27.704247+00');
INSERT INTO public.order_items VALUES (103, 51, 10, 'Măng Tây Xanh Thượng Hạng', 62000.00, 1.00, 62000.00, '2026-10-26 06:27:27.704247+00');
INSERT INTO public.order_items VALUES (104, 51, 14, 'Cam Sành Hàm Yên Mọng Nước', 42000.00, 1.00, 42000.00, '2026-10-26 06:27:27.704247+00');
INSERT INTO public.order_items VALUES (105, 51, 39, 'Hàu Sữa Cửa Lục Thái Bình Dương', 68000.00, 1.00, 68000.00, '2026-10-26 06:27:27.704247+00');
INSERT INTO public.order_items VALUES (106, 51, 75, 'Trà Hoa Cúc Vàng Sấy Lạnh Thanh Nhiệt', 75000.00, 1.00, 75000.00, '2026-10-26 06:27:27.704247+00');
INSERT INTO public.order_items VALUES (2, 1, NULL, 'Xà Lách Mỡ Butterhead Thủy Canh', 39000.00, 2.00, 78000.00, '2026-10-22 09:55:06.473515+00');
INSERT INTO public.order_items VALUES (4, 2, NULL, 'Xà Lách Mỡ Butterhead Thủy Canh', 39000.00, 2.00, 78000.00, '2026-10-22 09:55:06.473515+00');
INSERT INTO public.order_items VALUES (6, 3, NULL, 'Xà Lách Mỡ Butterhead Thủy Canh', 39000.00, 2.00, 78000.00, '2026-10-22 09:55:06.473515+00');
INSERT INTO public.order_items VALUES (8, 4, NULL, 'Xà Lách Mỡ Butterhead Thủy Canh', 39000.00, 2.00, 78000.00, '2026-10-22 09:55:06.473515+00');
INSERT INTO public.order_items VALUES (10, 5, NULL, 'Xà Lách Mỡ Butterhead Thủy Canh', 39000.00, 2.00, 78000.00, '2026-10-22 09:55:06.473515+00');
INSERT INTO public.order_items VALUES (12, 6, NULL, 'Xà Lách Mỡ Butterhead Thủy Canh', 39000.00, 2.00, 78000.00, '2026-10-22 09:55:06.473515+00');
INSERT INTO public.order_items VALUES (14, 7, NULL, 'Xà Lách Mỡ Butterhead Thủy Canh', 39000.00, 2.00, 78000.00, '2026-10-22 09:55:06.473515+00');
INSERT INTO public.order_items VALUES (16, 8, NULL, 'Xà Lách Mỡ Butterhead Thủy Canh', 39000.00, 2.00, 78000.00, '2026-10-22 09:55:06.473515+00');
INSERT INTO public.order_items VALUES (18, 9, NULL, 'Xà Lách Mỡ Butterhead Thủy Canh', 39000.00, 2.00, 78000.00, '2026-10-22 09:55:06.473515+00');
INSERT INTO public.order_items VALUES (20, 10, NULL, 'Xà Lách Mỡ Butterhead Thủy Canh', 39000.00, 2.00, 78000.00, '2026-10-22 09:55:06.473515+00');
INSERT INTO public.order_items VALUES (22, 11, NULL, 'Xà Lách Mỡ Butterhead Thủy Canh', 39000.00, 2.00, 78000.00, '2026-10-22 09:55:06.473515+00');
INSERT INTO public.order_items VALUES (24, 12, NULL, 'Xà Lách Mỡ Butterhead Thủy Canh', 39000.00, 2.00, 78000.00, '2026-10-22 09:55:06.473515+00');
INSERT INTO public.order_items VALUES (26, 13, NULL, 'Xà Lách Mỡ Butterhead Thủy Canh', 39000.00, 2.00, 78000.00, '2026-10-22 09:55:06.473515+00');
INSERT INTO public.order_items VALUES (28, 14, NULL, 'Xà Lách Mỡ Butterhead Thủy Canh', 39000.00, 2.00, 78000.00, '2026-10-22 09:55:06.473515+00');
INSERT INTO public.order_items VALUES (30, 15, NULL, 'Xà Lách Mỡ Butterhead Thủy Canh', 39000.00, 2.00, 78000.00, '2026-10-22 09:55:06.473515+00');
INSERT INTO public.order_items VALUES (32, 16, NULL, 'Xà Lách Mỡ Butterhead Thủy Canh', 39000.00, 2.00, 78000.00, '2026-10-22 09:55:06.473515+00');
INSERT INTO public.order_items VALUES (34, 17, NULL, 'Xà Lách Mỡ Butterhead Thủy Canh', 39000.00, 2.00, 78000.00, '2026-10-22 09:55:06.473515+00');
INSERT INTO public.order_items VALUES (36, 18, NULL, 'Xà Lách Mỡ Butterhead Thủy Canh', 39000.00, 2.00, 78000.00, '2026-10-22 09:55:06.473515+00');
INSERT INTO public.order_items VALUES (107, 52, 65, 'Đông Trùng Hạ Thảo Tươi Nuôi Cấy', 175000.00, 1.00, 175000.00, '2026-10-26 06:36:43.052572+00');
INSERT INTO public.order_items VALUES (108, 52, 17, 'Bơ Sáp 034 Lâm Đồng Dẻo Béo', 49000.00, 1.00, 49000.00, '2026-10-26 06:36:43.052572+00');
INSERT INTO public.order_items VALUES (109, 52, 21, 'Thịt Ba Chỉ Heo Thảo Mộc', 135000.00, 1.00, 135000.00, '2026-10-26 06:36:43.052572+00');
INSERT INTO public.order_items VALUES (110, 52, 15, 'Sầu Riêng Ri6 Cơm Vàng Hạt Lép', 140000.00, 1.00, 140000.00, '2026-10-26 06:36:43.052572+00');
INSERT INTO public.order_items VALUES (111, 52, 13, 'Dưa Lưới Huỳnh Long Ruột Cam', 85000.00, 1.00, 85000.00, '2026-10-26 06:36:43.052572+00');
INSERT INTO public.order_items VALUES (64, 32, NULL, 'Xà Lách Mỡ Butterhead Thủy Canh', 39000.00, 2.00, 78000.00, '2026-10-22 09:55:06.473515+00');
INSERT INTO public.order_items VALUES (66, 33, NULL, 'Xà Lách Mỡ Butterhead Thủy Canh', 39000.00, 2.00, 78000.00, '2026-10-22 09:55:06.473515+00');
INSERT INTO public.order_items VALUES (68, 34, NULL, 'Xà Lách Mỡ Butterhead Thủy Canh', 39000.00, 2.00, 78000.00, '2026-10-22 09:55:06.473515+00');
INSERT INTO public.order_items VALUES (70, 35, NULL, 'Xà Lách Mỡ Butterhead Thủy Canh', 39000.00, 2.00, 78000.00, '2026-10-22 09:55:06.473515+00');
INSERT INTO public.order_items VALUES (72, 36, NULL, 'Xà Lách Mỡ Butterhead Thủy Canh', 39000.00, 2.00, 78000.00, '2026-10-22 09:55:06.473515+00');
INSERT INTO public.order_items VALUES (74, 37, NULL, 'Xà Lách Mỡ Butterhead Thủy Canh', 39000.00, 2.00, 78000.00, '2026-10-22 09:55:06.473515+00');
INSERT INTO public.order_items VALUES (76, 38, NULL, 'Xà Lách Mỡ Butterhead Thủy Canh', 39000.00, 2.00, 78000.00, '2026-10-22 09:55:06.473515+00');
INSERT INTO public.order_items VALUES (78, 39, NULL, 'Xà Lách Mỡ Butterhead Thủy Canh', 39000.00, 2.00, 78000.00, '2026-10-22 09:55:06.473515+00');
INSERT INTO public.order_items VALUES (80, 40, NULL, 'Xà Lách Mỡ Butterhead Thủy Canh', 39000.00, 2.00, 78000.00, '2026-10-22 09:55:06.473515+00');
INSERT INTO public.order_items VALUES (82, 41, NULL, 'Xà Lách Mỡ Butterhead Thủy Canh', 39000.00, 2.00, 78000.00, '2026-10-22 09:55:06.473515+00');
INSERT INTO public.order_items VALUES (84, 42, NULL, 'Xà Lách Mỡ Butterhead Thủy Canh', 39000.00, 2.00, 78000.00, '2026-10-22 09:55:06.473515+00');
INSERT INTO public.order_items VALUES (86, 43, NULL, 'Xà Lách Mỡ Butterhead Thủy Canh', 39000.00, 2.00, 78000.00, '2026-10-22 09:55:06.473515+00');
INSERT INTO public.order_items VALUES (88, 44, NULL, 'Xà Lách Mỡ Butterhead Thủy Canh', 39000.00, 2.00, 78000.00, '2026-10-22 09:55:06.473515+00');
INSERT INTO public.order_items VALUES (90, 45, NULL, 'Xà Lách Mỡ Butterhead Thủy Canh', 39000.00, 2.00, 78000.00, '2026-10-22 09:55:06.473515+00');
INSERT INTO public.order_items VALUES (92, 46, NULL, 'Xà Lách Mỡ Butterhead Thủy Canh', 39000.00, 2.00, 78000.00, '2026-10-22 09:55:06.473515+00');
INSERT INTO public.order_items VALUES (94, 47, NULL, 'Xà Lách Mỡ Butterhead Thủy Canh', 39000.00, 2.00, 78000.00, '2026-10-22 09:55:06.473515+00');
INSERT INTO public.order_items VALUES (96, 48, NULL, 'Xà Lách Mỡ Butterhead Thủy Canh', 39000.00, 2.00, 78000.00, '2026-10-22 09:55:06.473515+00');
INSERT INTO public.order_items VALUES (98, 49, NULL, 'Xà Lách Mỡ Butterhead Thủy Canh', 39000.00, 2.00, 78000.00, '2026-10-22 09:55:06.473515+00');
INSERT INTO public.order_items VALUES (100, 50, NULL, 'Xà Lách Mỡ Butterhead Thủy Canh', 39000.00, 2.00, 78000.00, '2026-10-22 09:55:06.473515+00');
INSERT INTO public.order_items VALUES (63, 32, NULL, 'Cải Thìa Bạch Ngọc', 25000.00, 2.00, 50000.00, '2026-10-22 09:55:06.473515+00');
INSERT INTO public.order_items VALUES (65, 33, NULL, 'Cải Thìa Bạch Ngọc', 25000.00, 2.00, 50000.00, '2026-10-22 09:55:06.473515+00');
INSERT INTO public.order_items VALUES (67, 34, NULL, 'Cải Thìa Bạch Ngọc', 25000.00, 2.00, 50000.00, '2026-10-22 09:55:06.473515+00');
INSERT INTO public.order_items VALUES (69, 35, NULL, 'Cải Thìa Bạch Ngọc', 25000.00, 2.00, 50000.00, '2026-10-22 09:55:06.473515+00');
INSERT INTO public.order_items VALUES (71, 36, NULL, 'Cải Thìa Bạch Ngọc', 25000.00, 2.00, 50000.00, '2026-10-22 09:55:06.473515+00');
INSERT INTO public.order_items VALUES (73, 37, NULL, 'Cải Thìa Bạch Ngọc', 25000.00, 2.00, 50000.00, '2026-10-22 09:55:06.473515+00');
INSERT INTO public.order_items VALUES (75, 38, NULL, 'Cải Thìa Bạch Ngọc', 25000.00, 2.00, 50000.00, '2026-10-22 09:55:06.473515+00');
INSERT INTO public.order_items VALUES (77, 39, NULL, 'Cải Thìa Bạch Ngọc', 25000.00, 2.00, 50000.00, '2026-10-22 09:55:06.473515+00');
INSERT INTO public.order_items VALUES (79, 40, NULL, 'Cải Thìa Bạch Ngọc', 25000.00, 2.00, 50000.00, '2026-10-22 09:55:06.473515+00');
INSERT INTO public.order_items VALUES (81, 41, NULL, 'Cải Thìa Bạch Ngọc', 25000.00, 2.00, 50000.00, '2026-10-22 09:55:06.473515+00');
INSERT INTO public.order_items VALUES (83, 42, NULL, 'Cải Thìa Bạch Ngọc', 25000.00, 2.00, 50000.00, '2026-10-22 09:55:06.473515+00');
INSERT INTO public.order_items VALUES (85, 43, NULL, 'Cải Thìa Bạch Ngọc', 25000.00, 2.00, 50000.00, '2026-10-22 09:55:06.473515+00');
INSERT INTO public.order_items VALUES (87, 44, NULL, 'Cải Thìa Bạch Ngọc', 25000.00, 2.00, 50000.00, '2026-10-22 09:55:06.473515+00');
INSERT INTO public.order_items VALUES (89, 45, NULL, 'Cải Thìa Bạch Ngọc', 25000.00, 2.00, 50000.00, '2026-10-22 09:55:06.473515+00');
INSERT INTO public.order_items VALUES (91, 46, NULL, 'Cải Thìa Bạch Ngọc', 25000.00, 2.00, 50000.00, '2026-10-22 09:55:06.473515+00');
INSERT INTO public.order_items VALUES (93, 47, NULL, 'Cải Thìa Bạch Ngọc', 25000.00, 2.00, 50000.00, '2026-10-22 09:55:06.473515+00');
INSERT INTO public.order_items VALUES (95, 48, NULL, 'Cải Thìa Bạch Ngọc', 25000.00, 2.00, 50000.00, '2026-10-22 09:55:06.473515+00');
INSERT INTO public.order_items VALUES (97, 49, NULL, 'Cải Thìa Bạch Ngọc', 25000.00, 2.00, 50000.00, '2026-10-22 09:55:06.473515+00');
INSERT INTO public.order_items VALUES (99, 50, NULL, 'Cải Thìa Bạch Ngọc', 25000.00, 2.00, 50000.00, '2026-10-22 09:55:06.473515+00');


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.orders VALUES (8, 'ORD-2026-0008', 8, 'Mai Văn Hùng', '0903888999', '55 Phan Đăng Lưu, Phường 3, Phú Nhuận, TP. HCM', 'Gọi trước khi đến 15 phút', 680000.00, 0.00, 680000.00, 'VNPAY', 'PAID', 'SHIPPING', '2026-10-14 09:55:06.468386+00', '2026-10-22 09:57:19.086923+00', 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80', 'Đã giao 3 thùng xốp sầu riêng Ri6 và bơ sáp an toàn');
INSERT INTO public.orders VALUES (17, 'ORD-2026-0017', 17, 'Lương Xuân Trường', '0904777888', '290 Lý Thường Kiệt, Phường 14, Quận 10, TP. HCM', '', 540000.00, 0.00, 540000.00, 'BANK_TRANSFER', 'PAID', 'SHIPPING', '2026-10-22 09:35:06.468386+00', '2026-10-22 09:55:06.468386+00', 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=600&q=80', 'Đơn hàng đang giao');
INSERT INTO public.orders VALUES (18, 'ORD-2026-0018', 18, 'Nguyễn Công Phượng', '0904888999', '14 Nguyễn Văn Cừ, Phường Cầu Kho, Quận 1, TP. HCM', 'Để trước cửa phòng 402', 225000.00, 25000.00, 250000.00, 'VNPAY', 'PAID', 'SHIPPING', '2026-10-22 09:40:06.468386+00', '2026-10-22 09:55:06.468386+00', 'https://images.unsplash.com/photo-1526367790999-0150786686a2?w=600&q=80', 'Đang điều phối giao hàng');
INSERT INTO public.orders VALUES (51, 'VFT-20261026-6993', 55, 'Nguyễn Việt Dũng', '0363866296', 'hải dương', 'không', 309000.00, 0.00, 309000.00, 'COD', 'PAID', 'CONFIRMED', '2026-10-26 06:27:27.704247+00', '2026-10-26 06:33:21.623834+00', 'data:image/jpeg;base64,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', NULL);
INSERT INTO public.orders VALUES (1, 'ORD-2026-0001', 1, 'Ngô Thanh Vân', '0903111222', '120 Hai Bà Trưng, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh', 'Giao giờ hành chính lên lầu 4', 320000.00, 0.00, 320000.00, 'COD', 'PAID', 'DELIVERED', '2026-10-07 09:55:06.468386+00', '2026-10-22 09:55:06.468386+00', 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80', 'Đã chụp kiện hàng và khách ký nhận đầy đủ tại quầy lễ tân');
INSERT INTO public.orders VALUES (2, 'ORD-2026-0002', 2, 'Đặng Quốc Huy', '0903222333', '45 Lê Duẩn, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh', 'Để trước cửa bảo vệ nếu không nghe máy', 195000.00, 25000.00, 220000.00, 'BANK_TRANSFER', 'PAID', 'DELIVERED', '2026-10-08 09:55:06.468386+00', '2026-10-22 09:55:06.468386+00', 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80', 'Gửi bác bảo vệ ca trực sáng ký biên bản bàn giao thùng xốp lạnh');
INSERT INTO public.orders VALUES (52, 'VFT-20261026-8040', 5, 'Nguyễn Văn Huy', '0123456789', 'không có', 'không có', 584000.00, 0.00, 584000.00, 'COD', 'PAID', 'DELIVERED', '2026-10-26 06:36:43.052572+00', '2026-10-26 06:55:20.342974+00', 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCAHgAoADASIAAhEBAxEB/8QAHQABAAEFAQEBAAAAAAAAAAAAAAUBAgMEBgcICf/EAEsQAAEDAwIDBQUGAwQHBgcBAAEAAgMEBRESIQYxQRMiUWFxFDKBkaEHFSOxwdEzQlJicuHwCBYkU4KSsjQ1Q8LS8RcmY2R1oqPD/8QAGQEBAQEBAQEAAAAAAAAAAAAAAAECAwQF/8QAIhEBAQACAgMAAwEBAQAAAAAAAAECEQMhEjFBBBNRIjJC/9oADAMBAAIRAxEAPwD7LREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEVvaM3Ae0kcxla8ldCwkObIMddKDaRYoqmGRuWyDzzssqAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgFQ9zfKJHObJjSRyO3qpaRuthaTgEYWlWUsWnLnsaPFxwg5qSsna8vcQ9x5nCsdeJNndo7fmCDupGtp6KRmA9jHb7t5KFqqOEh2ioDxyzzwm1XvukgOpjyQRjHMK6C/TxY7zogD/AC7j45URJRnOY5hjzyFglhqIz7mseLN0NO1ouJ43/wAZgLfFm5UtT3WhnA0zhpPRwx/gvLiXMeHDLXEZ8CtuC4yRuYC5xHUtdg/HxRHqUb2SN1Rva9vi05CuXn9PWMlbiOYtdnJI2z6qVo73VwSATObURlvjv81Njq0WCirIKyMvhcTpOHAjBBWdUEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERARFZJNFGDre1uPFBeqEgcyAo+tuTYniOIAn+o8lgi9oq3kanNBGcuacIJUytzgblXjON1qx0UelvaEyOBzlbQAAAAAA5BAQ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RachvT5r03ie3xyRPkaDq0jYden7Lhqyif2hY5gBxnB6LPHlrqutxmU3HMyvc3YsOW8h4LUy9xxhT81I8SHUwnfA2WKWijleGaiHYyQ0LtLtys0imhmnYBxwpO1Us1TGS3TqYMgB2XN/wWCtoJYsdnA8gZySw49c8lks73wTGRjntJwO7zPl6fsqy6O0Vcpg05LA3AfHqy13qPmur4f9njDJ3diZXuBy7oPIAYHqVxtG1z6xrwCwyZDiBsepz5rpOHKc187OyBbE0/iOB3IznfzVSu5REUUREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQERDsMlBoXeWGSlmpy8axjII9CuRr6gFukR6ieQyMY/RT/YPLqioledDnEt89/wBlz8kGqoLnZwHHn18EGpUTGGF5aQ0Yxt0XPyjW8PLsZOSMbZwpm85hpnR6hqIO46H/ACVENb3W5znAQYIIQ9/eG52Xf8J2drWCZxIx1C5+wW901U3EYcSdjjkvRqKBtPTMiAAwN/Mrln/q+Lcuu2RjGsbhoACuRFvHGYzUYt2IioStCqplUQlBQ80REURERTKqqIiaVVQqAqoRFUREBERBbI0PYWnqMLnaiyl8kj3A+9tsP16LpEIB2IyuPJxeV3G8c7i4252MvjMjmNG+cA/AlclX08tOXsic5jgfHGQvXpI2SN0vaCPBcbxvaWxxmqgLmuxv1wpN4XtvymfWnI08juxd7ZHG/PLDiBjHjjmt6hoLRU5aJDSykANd2o3+f+d1A1tVX6XQ9rljcbEDHL0WhHPURFr2zytDeQzsV6Jpxs09GoRUWej7Gn7WYyODZI5o9yD4OB5eoU3wZSilZNG4YkwCd9jz/Zef2W9TOqoWF8rmtx2he/O3g0fyhdzYJxW1j3w6nCMNBAeBnxSjqUQct0UBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAWOqcG073F2kY5rItW7N1UL26tOSN/iEENVTvfGaaMgx7AYHzP5qMLg2OeoOQ1jyGt8cDf8Az5rPLiLXl2eePE7bKLvVU6KlLGBvdbpJ8XHmgga6ofUTEuxgEj1OVkgiL3x6jjZY6CnEjg7SCAQGt/qK67huz9rVOqJ2nQ08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', NULL);
INSERT INTO public.orders VALUES (3, 'ORD-2026-0003', 3, 'Bùi Phương Linh', '0903333444', '88 Nguyễn Đình Chiểu, Phường Đa Kao, Quận 1, TP. Hồ Chí Minh', 'Bọc kĩ rau mầm giúp mình', 285000.00, 0.00, 285000.00, 'VNPAY', 'PAID', 'DELIVERED', '2026-10-09 09:55:06.468386+00', '2026-10-22 09:55:06.468386+00', 'https://images.unsplash.com/photo-1566576912321-d58ddd743088?auto=format&fit=crop&w=600&q=80', 'Đã chụp đối chiếu mã đơn trên hóa đơn đóng gói kèm tem VietGAP');
INSERT INTO public.orders VALUES (4, 'ORD-2026-0004', 4, 'Vương Kiến Quốc', '0903444555', '12 Điện Biên Phủ, Phường 15, Quận Bình Thạnh, TP. HCM', 'Giao trước 11h sáng để kịp nấu cơm', 410000.00, 0.00, 410000.00, 'COD', 'PAID', 'DELIVERED', '2026-10-10 09:55:06.468386+00', '2026-10-22 09:55:06.468386+00', 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80', 'Khách đã thanh toán tiền mặt 410k, có hình ảnh phiếu thu');
INSERT INTO public.orders VALUES (5, 'ORD-2026-0005', 5, 'Lý Tiểu Long', '0903555666', '72 Hoàng Hoa Thám, Phường 7, Quận Bình Thạnh, TP. HCM', 'Nhà có chuông cổng màu xanh', 150000.00, 25000.00, 175000.00, 'MOMO', 'PAID', 'DELIVERED', '2026-10-11 09:55:06.468386+00', '2026-10-22 09:55:06.468386+00', 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80', 'Giao tận tay người nhận có chụp ảnh kèm thùng hàng nguyên vẹn');
INSERT INTO public.orders VALUES (6, 'ORD-2026-0006', 6, 'Hoàng Thị Hạnh', '0903666777', '215 Nam Kỳ Khởi Nghĩa, Phường 7, Quận 3, TP. HCM', 'Cần hóa đơn VAT gửi qua email', 520000.00, 0.00, 520000.00, 'BANK_TRANSFER', 'PAID', 'DELIVERED', '2026-10-12 09:55:06.468386+00', '2026-10-22 09:55:06.468386+00', 'https://images.unsplash.com/photo-1566576912321-d58ddd743088?auto=format&fit=crop&w=600&q=80', 'Đã chụp phiếu xuất kho và chữ ký kế toán nhận hàng');
INSERT INTO public.orders VALUES (7, 'ORD-2026-0007', 7, 'Dương Minh Châu', '0903777888', '140 Pasteur, Bến Nghé, Quận 1, TP. HCM', 'Hàng tươi sống giao sớm', 290000.00, 25000.00, 315000.00, 'COD', 'PAID', 'DELIVERED', '2026-10-13 09:55:06.468386+00', '2026-10-22 09:55:06.468386+00', 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80', 'Đã thu tiền COD đủ và gửi ảnh chụp túi nông sản sạch');
INSERT INTO public.orders VALUES (9, 'ORD-2026-0009', 9, 'Trịnh Kim Oanh', '0903999000', '18bis Nguyễn Thị Minh Khai, Đa Kao, Quận 1, TP. HCM', '', 210000.00, 25000.00, 235000.00, 'COD', 'PAID', 'DELIVERED', '2026-10-15 09:55:06.468386+00', '2026-10-22 09:55:06.468386+00', 'https://images.unsplash.com/photo-1566576912321-d58ddd743088?auto=format&fit=crop&w=600&q=80', 'Giao hàng thành công có chữ ký biên nhận');
INSERT INTO public.orders VALUES (10, 'ORD-2026-0010', 10, 'Lâm Khánh Chi', '0904000111', '33 Lê Văn Sỹ, Phường 13, Quận 3, TP. HCM', 'Giao cổng số 2', 340000.00, 0.00, 340000.00, 'MOMO', 'PAID', 'DELIVERED', '2026-10-16 09:55:06.468386+00', '2026-10-22 09:55:06.468386+00', 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80', 'Đã chụp ảnh gói hàng tại bàn giao nhận chung cư');
INSERT INTO public.orders VALUES (19, 'ORD-2026-0019', 19, 'Nguyễn Tuấn Anh', '0904999000', '77 Nguyễn Thái Bình, Phường 4, Tân Bình, TP. HCM', 'Chọn quả cà chua vàng mọng giúp', 320000.00, 0.00, 320000.00, 'COD', 'PENDING', 'PROCESSING', '2026-10-22 07:55:06.468386+00', '2026-10-22 09:55:06.468386+00', NULL, 'Nhân viên kho đang phân loại và hút chân không');
INSERT INTO public.orders VALUES (20, 'ORD-2026-0020', 20, 'Hà Đức Chinh', '0905000111', '104 Phổ Quang, Phường 2, Tân Bình, TP. HCM', '', 190000.00, 25000.00, 215000.00, 'MOMO', 'PAID', 'PROCESSING', '2026-10-22 08:55:06.468386+00', '2026-10-22 09:55:06.468386+00', NULL, 'Đang bọc túi xốp chống sốc cho dưa lưới Huỳnh Long');
INSERT INTO public.orders VALUES (21, 'ORD-2026-0021', 21, 'Nguyễn Tiến Linh', '0905111222', '58 Bạch Đằng, Phường 2, Tân Bình, TP. HCM', 'Cần gấp trước 18h', 470000.00, 0.00, 470000.00, 'BANK_TRANSFER', 'PAID', 'PROCESSING', '2026-10-22 09:05:06.468386+00', '2026-10-22 09:55:06.468386+00', NULL, 'Đã chuẩn bị xong hàng, chờ bàn giao đội giao vận');
INSERT INTO public.orders VALUES (22, 'ORD-2026-0022', 22, 'Vũ Văn Thanh', '0905222333', '12 Thăng Long, Phường 4, Tân Bình, TP. HCM', 'Lựa măng tây non mập', 360000.00, 0.00, 360000.00, 'VNPAY', 'PAID', 'PROCESSING', '2026-10-22 09:20:06.468386+00', '2026-10-22 09:55:06.468386+00', NULL, 'Đang dán tem mã QR truy xuất SHA-256');
INSERT INTO public.orders VALUES (23, 'ORD-2026-0023', 23, 'Nguyễn Phong Hồng Duy', '0905333444', '85 Cộng Hòa, Phường 4, Tân Bình, TP. HCM', '', 240000.00, 25000.00, 265000.00, 'COD', 'PENDING', 'PROCESSING', '2026-10-22 09:35:06.468386+00', '2026-10-22 09:55:06.468386+00', NULL, 'Đang sơ chế kiểm tra lá sâu trước khi đóng gói');
INSERT INTO public.orders VALUES (24, 'ORD-2026-0024', 24, 'Đỗ Duy Mạnh', '0905444555', '39 Trường Chinh, Phường 11, Tân Bình, TP. HCM', 'Giao kèm hóa đơn', 580000.00, 0.00, 580000.00, 'BANK_TRANSFER', 'PAID', 'PROCESSING', '2026-10-22 09:45:06.468386+00', '2026-10-22 09:55:06.468386+00', NULL, 'Đang xếp thùng lạnh bảo ôn');
INSERT INTO public.orders VALUES (25, 'ORD-2026-0025', 25, 'Trần Đình Trọng', '0905555666', '12 Hoàng Văn Thụ, Phường 9, Phú Nhuận, TP. HCM', 'Khách yêu cầu gọi trước', 420000.00, 0.00, 420000.00, 'COD', 'PENDING', 'CONFIRMED', '2026-10-22 06:55:06.468386+00', '2026-10-22 09:55:06.468386+00', NULL, 'Nhân viên CSKH đã liên hệ xác nhận đơn qua điện thoại');
INSERT INTO public.orders VALUES (26, 'ORD-2026-0026', 26, 'Bùi Tấn Trường', '0905666777', '68 Phan Xích Long, Phường 2, Phú Nhuận, TP. HCM', '', 210000.00, 25000.00, 235000.00, 'VNPAY', 'PAID', 'CONFIRMED', '2026-10-22 07:55:06.468386+00', '2026-10-22 09:55:06.468386+00', NULL, 'Đã nhận chuyển khoản VNPAY thành công');
INSERT INTO public.orders VALUES (27, 'ORD-2026-0027', 27, 'Phạm Tuấn Hải', '0905777888', '115 Hoa Lan, Phường 2, Phú Nhuận, TP. HCM', 'Giao sáng mai', 380000.00, 0.00, 380000.00, 'MOMO', 'PAID', 'CONFIRMED', '2026-10-22 08:55:06.468386+00', '2026-10-22 09:55:06.468386+00', NULL, 'Đã lên lịch xuất kho ca sáng');
INSERT INTO public.orders VALUES (28, 'ORD-2026-0028', 28, 'Nguyễn Thành Chung', '0905888999', '204 Hoa Sứ, Phường 7, Phú Nhuận, TP. HCM', '', 175000.00, 25000.00, 200000.00, 'COD', 'PENDING', 'CONFIRMED', '2026-10-22 09:10:06.468386+00', '2026-10-22 09:55:06.468386+00', NULL, 'Chờ kho chính duyệt xuất hàng');
INSERT INTO public.orders VALUES (11, 'ORD-2026-0011', 11, 'Hồ Gia Bảo', '0904111222', '102 Nguyễn Du, Phường Bến Nghé, Quận 1, TP. HCM', 'Giao gấp buổi trưa', 450000.00, 0.00, 450000.00, 'COD', 'PENDING', 'SHIPPING', '2026-10-22 06:55:06.468386+00', '2026-10-22 09:55:06.468386+00', 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=600&q=80', 'Shipper Nguyễn Văn Bình đang di chuyển giao hàng');
INSERT INTO public.orders VALUES (29, 'ORD-2026-0029', 29, 'Bùi Hoàng Việt Anh', '0905999000', '42 Đặng Văn Ngữ, Phường 10, Phú Nhuận, TP. HCM', 'Đơn đặt định kỳ hàng tuần', 630000.00, 0.00, 630000.00, 'BANK_TRANSFER', 'PAID', 'CONFIRMED', '2026-10-22 09:25:06.468386+00', '2026-10-22 09:55:06.468386+00', NULL, 'Đã xác nhận thanh toán ngân hàng');
INSERT INTO public.orders VALUES (30, 'ORD-2026-0030', 30, 'Nguyễn Thanh Bình', '0906000111', '88 Huỳnh Văn Bánh, Phường 15, Phú Nhuận, TP. HCM', '', 295000.00, 25000.00, 320000.00, 'COD', 'PENDING', 'CONFIRMED', '2026-10-22 09:40:06.468386+00', '2026-10-22 09:55:06.468386+00', NULL, 'Đã chuyển phiếu in kho đóng gói');
INSERT INTO public.orders VALUES (31, 'ORD-2026-0031', 31, 'Hồ Tấn Tài', '0906111222', '15 Thảo Điền, Phường Thảo Điền, TP. Thủ Đức, TP. HCM', 'Nhà trong hẻm xe hơi vào được', 480000.00, 0.00, 480000.00, 'COD', 'PENDING', 'PENDING', '2026-10-22 09:05:06.468386+00', '2026-10-22 09:55:06.468386+00', NULL, NULL);
INSERT INTO public.orders VALUES (32, 'ORD-2026-0032', 32, 'Nhâm Mạnh Dũng', '0906222333', '24 Quốc Hương, Phường Thảo Điền, TP. Thủ Đức, TP. HCM', '', 220000.00, 25000.00, 245000.00, 'BANK_TRANSFER', 'PENDING', 'PENDING', '2026-10-22 09:15:06.468386+00', '2026-10-22 09:55:06.468386+00', NULL, NULL);
INSERT INTO public.orders VALUES (33, 'ORD-2026-0033', 33, 'Khuất Văn Khang', '0906333444', '89 Xuân Thủy, Phường Thảo Điền, TP. Thủ Đức, TP. HCM', 'Chọn rau tươi mới hái', 310000.00, 0.00, 310000.00, 'COD', 'PENDING', 'PENDING', '2026-10-22 09:25:06.468386+00', '2026-10-22 09:55:06.468386+00', NULL, NULL);
INSERT INTO public.orders VALUES (34, 'ORD-2026-0034', 34, 'Nguyễn Thái Sơn', '0906444555', '50 Mai Chí Thọ, Phường An Phú, TP. Thủ Đức, TP. HCM', 'Khách chuyển khoản sau', 160000.00, 25000.00, 185000.00, 'BANK_TRANSFER', 'PENDING', 'PENDING', '2026-10-22 09:30:06.468386+00', '2026-10-22 09:55:06.468386+00', NULL, NULL);
INSERT INTO public.orders VALUES (35, 'ORD-2026-0035', 1, 'Ngô Thanh Vân', '0903111222', '120 Hai Bà Trưng, Phường Bến Nghé, Quận 1, TP. HCM', 'Đặt thêm nấm bào ngư và gạo ST25', 510000.00, 0.00, 510000.00, 'VNPAY', 'PENDING', 'PENDING', '2026-10-22 09:35:06.468386+00', '2026-10-22 09:55:06.468386+00', NULL, NULL);
INSERT INTO public.orders VALUES (36, 'ORD-2026-0036', 2, 'Đặng Quốc Huy', '0903222333', '45 Lê Duẩn, Phường Bến Nghé, Quận 1, TP. HCM', '', 390000.00, 0.00, 390000.00, 'COD', 'PENDING', 'PENDING', '2026-10-22 09:40:06.468386+00', '2026-10-22 09:55:06.468386+00', NULL, NULL);
INSERT INTO public.orders VALUES (37, 'ORD-2026-0037', 3, 'Bùi Phương Linh', '0903333444', '88 Nguyễn Đình Chiểu, Phường Đa Kao, Quận 1, TP. HCM', '', 180000.00, 25000.00, 205000.00, 'MOMO', 'PENDING', 'PENDING', '2026-10-22 09:45:06.468386+00', '2026-10-22 09:55:06.468386+00', NULL, NULL);
INSERT INTO public.orders VALUES (38, 'ORD-2026-0038', 4, 'Vương Kiến Quốc', '0903444555', '12 Điện Biên Phủ, Phường 15, Bình Thạnh, TP. HCM', 'Giao buổi tối sau 18h', 335000.00, 0.00, 335000.00, 'COD', 'PENDING', 'PENDING', '2026-10-22 09:50:06.468386+00', '2026-10-22 09:55:06.468386+00', NULL, NULL);
INSERT INTO public.orders VALUES (39, 'ORD-2026-0039', 5, 'Lý Tiểu Long', '0903555666', '72 Hoàng Hoa Thám, Phường 7, Bình Thạnh, TP. HCM', 'Khách bận đi công tác đột xuất', 260000.00, 25000.00, 285000.00, 'COD', 'FAILED', 'CANCELLED', '2026-10-18 09:55:06.468386+00', '2026-10-22 09:55:06.468386+00', NULL, 'Khách hàng hủy đơn, hệ thống đã tự động hoàn trả tồn kho sản phẩm');
INSERT INTO public.orders VALUES (40, 'ORD-2026-0040', 6, 'Hoàng Thị Hạnh', '0903666777', '215 Nam Kỳ Khởi Nghĩa, Phường 7, Quận 3, TP. HCM', 'Đặt trùng 2 đơn liền nhau', 420000.00, 0.00, 420000.00, 'BANK_TRANSFER', 'REFUNDED', 'CANCELLED', '2026-10-19 09:55:06.468386+00', '2026-10-22 09:55:06.468386+00', NULL, 'Đã hoàn tiền 100% qua tài khoản ngân hàng của khách');
INSERT INTO public.orders VALUES (41, 'ORD-2026-0041', 7, 'Dương Minh Châu', '0903777888', '140 Pasteur, Bến Nghé, Quận 1, TP. HCM', 'Khách đổi sang mua combo tuần', 315000.00, 0.00, 315000.00, 'MOMO', 'REFUNDED', 'CANCELLED', '2026-10-20 09:55:06.468386+00', '2026-10-22 09:55:06.468386+00', NULL, 'Đã hủy và hoàn tiền ví điện tử MoMo');
INSERT INTO public.orders VALUES (42, 'ORD-2026-0042', 8, 'Mai Văn Hùng', '0903888999', '55 Phan Đăng Lưu, Phường 3, Phú Nhuận, TP. HCM', 'Sai số điện thoại không liên lạc được', 190000.00, 25000.00, 215000.00, 'COD', 'FAILED', 'CANCELLED', '2026-10-21 09:55:06.468386+00', '2026-10-22 09:55:06.468386+00', NULL, 'Hủy tự động do không liên lạc được khách sau 3 lần gọi');
INSERT INTO public.orders VALUES (43, 'ORD-2026-0043', 9, 'Trịnh Kim Oanh', '0903999000', '18bis Nguyễn Thị Minh Khai, Đa Kao, Quận 1, TP. HCM', 'Thay đổi địa chỉ nhận hàng xa hơn', 280000.00, 0.00, 280000.00, 'COD', 'FAILED', 'CANCELLED', '2026-10-21 21:55:06.468386+00', '2026-10-22 09:55:06.468386+00', NULL, 'Hủy đơn cũ theo yêu cầu khách để tạo đơn mới');
INSERT INTO public.orders VALUES (44, 'ORD-2026-0044', 10, 'Lâm Khánh Chi', '0904000111', '33 Lê Văn Sỹ, Phường 13, Quận 3, TP. HCM', 'Giao hỏa tốc 2 giờ', 490000.00, 0.00, 490000.00, 'VNPAY', 'PAID', 'DELIVERED', '2026-10-17 09:55:06.468386+00', '2026-10-22 09:55:06.468386+00', 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80', 'Đã chụp kiện hàng và chữ ký người nhận thành công');
INSERT INTO public.orders VALUES (45, 'ORD-2026-0045', 11, 'Hồ Gia Bảo', '0904111222', '102 Nguyễn Du, Bến Nghé, Quận 1, TP. HCM', '', 230000.00, 25000.00, 255000.00, 'COD', 'PAID', 'DELIVERED', '2026-10-18 09:55:06.468386+00', '2026-10-22 09:55:06.468386+00', 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80', 'Thu tiền mặt tại sảnh tòa nhà');
INSERT INTO public.orders VALUES (46, 'ORD-2026-0046', 12, 'Tô Mỹ Uyên', '0904222333', '26 Phạm Ngọc Thạch, Quận 3, TP. HCM', '', 365000.00, 0.00, 365000.00, 'BANK_TRANSFER', 'PAID', 'DELIVERED', '2026-10-19 09:55:06.468386+00', '2026-10-22 09:55:06.468386+00', 'https://images.unsplash.com/photo-1566576912321-d58ddd743088?auto=format&fit=crop&w=600&q=80', 'Đã chụp biên bản bàn giao đầy đủ hàng');
INSERT INTO public.orders VALUES (47, 'ORD-2026-0047', 13, 'Đoàn Văn Hậu', '0904333444', '48 Trần Hưng Đạo, Quận 1, TP. HCM', '', 415000.00, 0.00, 415000.00, 'MOMO', 'PAID', 'DELIVERED', '2026-10-20 09:55:06.468386+00', '2026-10-22 09:55:06.468386+00', 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80', 'Giao hàng thành công');
INSERT INTO public.orders VALUES (48, 'ORD-2026-0048', 14, 'Nguyễn Quang Hải', '0904444555', '99 Võ Thị Sáu, Quận 3, TP. HCM', '', 280000.00, 0.00, 280000.00, 'VNPAY', 'PAID', 'DELIVERED', '2026-10-21 09:55:06.468386+00', '2026-10-22 09:55:06.468386+00', 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80', 'Khách xác nhận nhận hàng hài lòng');
INSERT INTO public.orders VALUES (49, 'ORD-2026-0049', 15, 'Phan Văn Đức', '0904555666', '15 Nguyễn Thị Diệu, Quận 3, TP. HCM', '', 530000.00, 0.00, 530000.00, 'COD', 'PAID', 'DELIVERED', '2026-10-21 15:55:06.468386+00', '2026-10-22 09:55:06.468386+00', 'https://images.unsplash.com/photo-1566576912321-d58ddd743088?auto=format&fit=crop&w=600&q=80', 'Giao hàng thành công kèm quà tặng hạt giống VFT');
INSERT INTO public.orders VALUES (50, 'ORD-2026-0050', 16, 'Quế Ngọc Hải', '0904666777', '180 Cao Thắng, Quận 10, TP. HCM', '', 345000.00, 0.00, 345000.00, 'BANK_TRANSFER', 'PAID', 'DELIVERED', '2026-10-22 01:55:06.468386+00', '2026-10-22 09:55:06.468386+00', 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80', 'Đã chuyển hàng hoàn tất');
INSERT INTO public.orders VALUES (12, 'ORD-2026-0012', 12, 'Tô Mỹ Uyên', '0904222333', '26 Phạm Ngọc Thạch, Phường 6, Quận 3, TP. HCM', 'Gọi số bàn 028.382211', 185000.00, 25000.00, 210000.00, 'BANK_TRANSFER', 'PAID', 'SHIPPING', '2026-10-22 07:55:06.468386+00', '2026-10-22 09:55:06.468386+00', 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=600&q=80', 'Đã xuất kho bãi Quận 3 lúc 14:00');
INSERT INTO public.orders VALUES (13, 'ORD-2026-0013', 13, 'Đoàn Văn Hậu', '0904333444', '48 Trần Hưng Đạo, Phường Cầu Ông Lãnh, Quận 1, TP. HCM', '', 390000.00, 0.00, 390000.00, 'VNPAY', 'PAID', 'SHIPPING', '2026-10-22 08:55:06.468386+00', '2026-10-22 09:55:06.468386+00', 'https://images.unsplash.com/photo-1526367790999-0150786686a2?w=600&q=80', 'Đang trên xe chuyên dụng bảo ôn nhiệt độ 16 độ C');
INSERT INTO public.orders VALUES (14, 'ORD-2026-0014', 14, 'Nguyễn Quang Hải', '0904444555', '99 Võ Thị Sáu, Phường 6, Quận 3, TP. HCM', 'Khách dặn bấm chuông ngoài', 270000.00, 25000.00, 295000.00, 'COD', 'PENDING', 'SHIPPING', '2026-10-22 09:15:06.468386+00', '2026-10-22 09:55:06.468386+00', 'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?w=600&q=80', 'Shipper Trần Văn Tùng đang giao');
INSERT INTO public.orders VALUES (15, 'ORD-2026-0015', 15, 'Phan Văn Đức', '0904555666', '15 Nguyễn Thị Diệu, Phường 6, Quận 3, TP. HCM', 'Kèm thêm đá gel giữ lạnh', 620000.00, 0.00, 620000.00, 'MOMO', 'PAID', 'SHIPPING', '2026-10-22 09:25:06.468386+00', '2026-10-22 09:55:06.468386+00', 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&q=80', 'Đã rời trạm trung chuyển trung tâm');
INSERT INTO public.orders VALUES (16, 'ORD-2026-0016', 16, 'Quế Ngọc Hải', '0904666777', '180 Cao Thắng, Phường 12, Quận 10, TP. HCM', 'Giao trước 17h chiều', 310000.00, 0.00, 310000.00, 'COD', 'PENDING', 'SHIPPING', '2026-10-22 09:30:06.468386+00', '2026-10-22 09:55:06.468386+00', 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=600&q=80', 'Shipper đang trên đường vận chuyển');


--
-- Data for Name: policies; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.policies VALUES (1, 'Cam kết dịch vụ', 'cam-ket-dich-vu', 'VFT Farms cam kết 100% sản phẩm nông sản và thực phẩm phân phối đều đạt chứng nhận an toàn VietGAP, VfSC hoặc canh tác hữu cơ tự nhiên. Hoàn tiền 100% nếu phát hiện hàng kém chất lượng.', 'CAM_KET', 1, '2026-10-22 07:09:17.856571+00', '2026-10-22 07:09:17.856571+00');
INSERT INTO public.policies VALUES (2, 'Chính sách bán hàng', 'chinh-sach-ban-hang', 'Mọi đơn hàng được tiếp nhận và xử lý nhanh chóng trong vòng 30 phút. Khách hàng có thể mua sắm tiện lợi trực tiếp trên Website hoặc qua Tổng đài hỗ trợ 02432029199.', 'BAN_HANG', 2, '2026-10-22 07:09:17.856571+00', '2026-10-22 07:09:17.856571+00');
INSERT INTO public.policies VALUES (3, 'Hình thức & chính sách thanh toán', 'hinh-thuc-thanh-toan', 'Hỗ trợ thanh toán linh hoạt: COD (Tiền mặt khi nhận hàng), Chuyển khoản ngân hàng trực tiếp qua VietQR, Ví điện tử MoMo, VNPay.', 'THANH_TOAN', 3, '2026-10-22 07:09:17.856571+00', '2026-10-22 07:09:17.856571+00');
INSERT INTO public.policies VALUES (4, 'Chính sách đổi trả hàng', 'chinh-sach-doi-tra', 'Khách hàng được quyền kiểm tra hàng trước khi thanh toán. Đổi trả ngay lập tức trong 24h nếu sản phẩm bị hư hỏng, dập nát do quá trình vận chuyển hoặc không đúng quy cách.', 'DOI_TRA', 4, '2026-10-22 07:09:17.856571+00', '2026-10-22 07:09:17.856571+00');
INSERT INTO public.policies VALUES (5, 'Chính sách giao hàng', 'chinh-sach-giao-hang', 'Giao hàng nhanh nội thành trong vòng 2 giờ cho các đơn hàng tươi sống. Miễn phí giao hàng cho hóa đơn từ 300.000đ.', 'GIAO_HANG', 5, '2026-10-22 07:09:17.856571+00', '2026-10-22 07:09:17.856571+00');
INSERT INTO public.policies VALUES (6, 'Chính sách bảo mật', 'chinh-sach-bao-mat', 'VFT Farms cam kết bảo mật tuyệt đối mọi thông tin cá nhân của khách hàng theo tiêu chuẩn an toàn bảo mật dữ liệu.', 'BAO_MAT', 6, '2026-10-22 07:09:17.856571+00', '2026-10-22 07:09:17.856571+00');


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.products VALUES (39, 4, 'Hàu Sữa Cửa Lục Thái Bình Dương', 'hau-sua-cua-luc-thai-binh-duong', 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&q=80', '[]', 'Kg', 'Túi 1kg', 75000.00, 68000.00, 99.00, 'VietGAP', 'HTX Nuôi Hàu Quảng Ninh', false, false, 'Hàu sữa béo tròn mọng sữa, giàu kẽm và vi chất, làm hàu nướng mỡ hành hay ăn sống chanh mù tạt.', '2026-10-25 11:41:05.361365+00', '2026-10-25 11:41:05.361365+00');
INSERT INTO public.products VALUES (75, 8, 'Trà Hoa Cúc Vàng Sấy Lạnh Thanh Nhiệt', 'tra-hoa-cuc-vang-say-lanh', 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=600&q=80', '[]', 'Hũ', 'Hũ 100g', 85000.00, 75000.00, 119.00, 'Organic', 'Cánh Đồng Cúc Hữu Cơ Nghĩa Trai', false, false, 'Bông cúc sấy lạnh giữ trọn màu vàng tươi và hương tinh dầu, giải nhiệt an thần giấc ngủ êm.', '2026-10-25 11:41:05.361365+00', '2026-10-25 11:41:05.361365+00');
INSERT INTO public.products VALUES (5, 1, 'Cà Rốt Đà Lạt Chuẩn Tươi', 'ca-rot-da-lat-chuan-tuoi', '/images/products/carrot.svg', '[]', 'Kg', 'Túi 1kg', 32000.00, NULL, 195.00, 'VietGAP', 'Nông Trại VFT Lâm Đồng', false, false, 'Cà rốt tươi giàu Vitamin A, củ thuôn đều màu cam đậm, thích hợp ép nước và nấu món hầm.', '2026-10-26 06:40:08.866991+00', '2026-10-26 06:40:08.866991+00');
INSERT INTO public.products VALUES (8, 1, 'Cải Thìa Bạch Ngọc Hữu Cơ', 'cai-thia-bach-ngoc-huu-co', 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&q=80', '[]', 'Bó', 'Bó 500g', 24000.00, NULL, 160.00, 'Organic', 'VFT Organic Garden', false, false, 'Cải thìa bẹ trắng dày giòn mọng nước, nuôi dưỡng bằng phân trùn quế sinh học tự nhiên.', '2026-10-26 06:40:08.866991+00', '2026-10-26 06:40:08.866991+00');
INSERT INTO public.products VALUES (7, 1, 'Cải Bó Xôi Chân Vịt (Spinach)', 'cai-bo-xoi-chan-vit', 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&q=80', '[]', 'Bó', 'Bó 400g', 35000.00, 32000.00, 109.00, 'VietGAP', 'HTX Nông Nghiệp Đà Lạt', false, true, 'Rau chân vịt giàu sắt, canxi và chất chống oxy hóa, món ăn vàng cho sức khỏe tim mạch.', '2026-10-25 11:41:05.361365+00', '2026-10-25 11:41:05.361365+00');
INSERT INTO public.products VALUES (10, 1, 'Măng Tây Xanh Thượng Hạng', 'mang-tay-xanh-thuong-hang', 'https://images.unsplash.com/photo-1515471204630-f6551b9d40b4?w=600&q=80', '[]', 'Bó', 'Bó 350g', 68000.00, 62000.00, 84.00, 'VietGAP', 'HTX Măng Tây Ninh Thuận', true, true, 'Măng tây xanh loại 1 thân mập đầu búp chắc, giòn ngọt thanh tao cho bữa ăn cao cấp.', '2026-10-25 11:41:05.361365+00', '2026-10-25 11:41:05.361365+00');
INSERT INTO public.products VALUES (1, 1, 'Bắp Cải VietGAP Đà Lạt', 'bap-cai-vietgap-da-lat', '/images/products/cabbage.svg', '[]', 'Kg', 'Túi 1.2kg', 33000.00, 30000.00, 239.50, 'VietGAP', 'HTX Nông Nghiệp VFT Đà Lạt', true, true, 'Bắp cải tươi giòn ngọt tự nhiên, bắp cuộn chặt, kiểm định không tồn dư hóa chất VietGAP.', '2026-10-25 11:41:05.361365+00', '2026-10-25 11:41:05.361365+00');
INSERT INTO public.products VALUES (2, 1, 'Bí Nụ Non Tươi Sạch', 'bi-nu-non-tuoi-sach', '/images/products/baby-pumpkin.svg', '[]', 'Kg', 'Hộp 500g', 38000.00, 35000.00, 180.00, 'VietGAP', 'VFT Farms Farm 1', true, true, 'Bí nụ non tươi ngon giòn ngọt, giàu khoáng chất, thích hợp xào tỏi hoặc nấu canh thanh mát.', '2026-10-25 11:41:05.361365+00', '2026-10-25 11:41:05.361365+00');
INSERT INTO public.products VALUES (3, 1, 'Cà Chua Cherry Chín Mọng', 'ca-chua-cherry-chin-mong', '/images/products/tomato.svg', '[]', 'Hộp', 'Hộp 500g', 28000.00, 25000.00, 210.00, 'VfSC', 'VFT Farms Farm 2', true, true, 'Cà chua cherry đỏ mọng nước, giàu lycopene, vị ngọt thanh tự nhiên chuỗi an toàn VfSC.', '2026-10-25 11:41:05.361365+00', '2026-10-25 11:41:05.361365+00');
INSERT INTO public.products VALUES (4, 1, 'Rau Cải Ngọt Canh Tác Tự Nhiên', 'rau-cai-ngot-canh-tac-tu-nhien', '/images/products/greens.svg', '[]', 'Bó', 'Bó 500g', 22000.00, 20000.00, 150.00, 'VietGAP', 'HTX Rau Sạch Đan Phượng', false, true, 'Rau cải ngọt thu hoạch trong sáng sớm, cọng xanh non giòn ngọt, tuyệt đối an toàn.', '2026-10-25 11:41:05.361365+00', '2026-10-25 11:41:05.361365+00');
INSERT INTO public.products VALUES (6, 1, 'Xà Lách Mỡ Butterhead Thủy Canh', 'xa-lach-mo-butterhead-thuy-canh', 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=600&q=80', '[]', 'Cây', 'Túi 400g', 29000.00, 26000.00, 140.00, 'Organic', 'Nhà Màng Công Nghệ Cao VFT', true, false, 'Xà lách búp mỡ mềm mượt, lá xanh non giòn ngọt, canh tác thủy canh hồi lưu khép kín.', '2026-10-25 11:41:05.361365+00', '2026-10-25 11:41:05.361365+00');
INSERT INTO public.products VALUES (9, 1, 'Ớt Chuông Đà Lạt 3 Màu', 'ot-chuong-da-lat-3-mau', 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=600&q=80', '[]', 'Kg', 'Túi 500g', 45000.00, 42000.00, 130.00, 'VietGAP', 'Trang Trại VFT Farm Đà Lạt', true, false, 'Ớt chuông đỏ, vàng, xanh giòn ngọt không hăng, dồi dào Vitamin C gấp 3 lần cam tươi.', '2026-10-25 11:41:05.361365+00', '2026-10-25 11:41:05.361365+00');
INSERT INTO public.products VALUES (11, 2, 'Bưởi Da Xanh Bến Tre Loại 1', 'buoi-da-xanh-ben-tre-loai-1', 'https://images.unsplash.com/photo-1577234286642-fc512a5f8f11?w=600&q=80', '[]', 'Trái', 'Quả 1.4kg', 65000.00, 58000.00, 120.00, 'VietGAP', 'HTX Bưởi Da Xanh Mỏ Cày', true, true, 'Tép bưởi hồng mọng nước, vị ngọt thanh không chua chát, bóc vỏ dóc tép tiện lợi.', '2026-10-25 11:41:05.361365+00', '2026-10-25 11:41:05.361365+00');
INSERT INTO public.products VALUES (12, 2, 'Xoài Cát Hòa Lộc Chín Cây', 'xoai-cat-hoa-loc-chin-cay', 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=600&q=80', '[]', 'Kg', 'Hộp 1kg', 85000.00, 79000.00, 95.00, 'VietGAP', 'Vùng Trồng Xoài Cái Bè', true, true, 'Xoài thơm ngát nức lòng, thịt vàng óng dẻo quánh, vị ngọt lịm đặc trưng miền Tây.', '2026-10-25 11:41:05.361365+00', '2026-10-25 11:41:05.361365+00');
INSERT INTO public.products VALUES (16, 2, 'Thanh Long Ruột Đỏ Bình Thuận', 'thanh-long-ruot-do-binh-thuan', 'https://images.unsplash.com/photo-1527325678964-54921661f888?w=600&q=80', '[]', 'Kg', 'Túi 1kg', 36000.00, 32000.00, 130.00, 'VietGAP', 'HTX Thanh Long Hàm Thuận', false, false, 'Thanh long ruột đỏ thắm ngọt ngào, giàu chất xơ và Betacyanin chống lão hóa vượt trội.', '2026-10-25 11:41:05.361365+00', '2026-10-25 11:41:05.361365+00');
INSERT INTO public.products VALUES (18, 2, 'Nho Xanh Ninh Thuận Không Hạt', 'nho-xanh-ninh-thuan-khong-hat', 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=600&q=80', '[]', 'Hộp', 'Hộp 1kg', 78000.00, 72000.00, 80.00, 'VietGAP', 'Trang Trại Nho Ba Mọi', false, true, 'Chùm quả chắc mọng, vỏ mỏng giòn ngọt nhẹ thanh khiết, trẻ nhỏ và người lớn đều mê.', '2026-10-25 11:41:05.361365+00', '2026-10-25 11:41:05.361365+00');
INSERT INTO public.products VALUES (19, 2, 'Chuối Tiêu Hồng Sạch Lão Nông', 'chuoi-tieu-hong-sach-lao-nong', 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&q=80', '[]', 'Nải', 'Nải 1.5kg', 35000.00, 30000.00, 140.00, 'Organic', 'HTX Chuối Sạch Hưng Yên', false, false, 'Chuối già hương chín tự nhiên không ủ hóa chất, hương thơm nồng nàn vị ngọt bổ dưỡng.', '2026-10-25 11:41:05.361365+00', '2026-10-25 11:41:05.361365+00');
INSERT INTO public.products VALUES (14, 2, 'Cam Sành Hàm Yên Mọng Nước', 'cam-sanh-ham-yen-mong-nuoc', 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=600&q=80', '[]', 'Kg', 'Túi 2kg', 48000.00, 42000.00, 159.00, 'VietGAP', 'HTX Nông Nghiệp Hàm Yên', false, true, 'Cam sành lòng vàng nhiều nước ngọt đậm đà, bổ sung đề kháng tự nhiên cho cả nhà.', '2026-10-25 11:41:05.361365+00', '2026-10-25 11:41:05.361365+00');
INSERT INTO public.products VALUES (17, 2, 'Bơ Sáp 034 Lâm Đồng Dẻo Béo', 'bo-sap-034-lam-dong-deo-beo', 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=600&q=80', '[]', 'Kg', 'Túi 1kg', 55000.00, 49000.00, 89.00, 'VietGAP', 'Nông Hộ VFT Bảo Lộc', true, false, 'Quả bơ dài hạt lép, cơm vàng dẻo quánh béo ngậy tự nhiên, dồi dào chất béo lành mạnh.', '2026-10-25 11:41:05.361365+00', '2026-10-25 11:41:05.361365+00');
INSERT INTO public.products VALUES (15, 2, 'Sầu Riêng Ri6 Cơm Vàng Hạt Lép', 'sau-rieng-ri6-com-vang-hat-lep', 'https://images.unsplash.com/photo-1587132137056-bfbf0166836e?w=600&q=80', '[]', 'Khay', 'Khay 500g', 155000.00, 140000.00, 59.00, 'VietGAP', 'HTX Sầu Riêng Long Khánh', true, true, 'Cơm sầu dày vàng ươm, dẻo béo ngậy ngọt đậm, đóng khay sạch bảo quản mát tiện lợi.', '2026-10-25 11:41:05.361365+00', '2026-10-25 11:41:05.361365+00');
INSERT INTO public.products VALUES (13, 2, 'Dưa Lưới Huỳnh Long Ruột Cam', 'dua-luoi-huynh-long-ruot-cam', 'https://images.unsplash.com/photo-1571575179703-4bde4ee66373?w=600&q=80', '[]', 'Trái', 'Quả 1.5kg', 92000.00, 85000.00, 74.00, 'Organic', 'Nông Trại VFT GreenHouse', true, false, 'Vỏ vân lưới dày đẹp, ruột cam giòn tan mát lịm, độ ngọt Brix 14+ đạt chuẩn xuất khẩu.', '2026-10-25 11:41:05.361365+00', '2026-10-25 11:41:05.361365+00');
INSERT INTO public.products VALUES (20, 2, 'Ổi Nữ Hoàng Giòn Ngọt Ít Hạt', 'oi-nu-hoang-gion-ngot-it-hat', 'https://images.unsplash.com/photo-1536511135899-73e2a22f36f6?w=600&q=80', '[]', 'Kg', 'Túi 1kg', 28000.00, 25000.00, 170.00, 'VietGAP', 'VFT Fruit Garden Vĩnh Long', false, false, 'Ổi giòn sần sật, ruột mềm ít hạt vị chua ngọt thanh tao, chứa hàm lượng vitamin C cực cao.', '2026-10-25 11:41:05.361365+00', '2026-10-25 11:41:05.361365+00');
INSERT INTO public.products VALUES (22, 3, 'Thịt Bò Úc Tươi Mềm Cao Cấp', 'thit-bo-uc-tuoi-mem-cao-cap', '/images/products/beef.svg', '[]', 'Kg', 'Khay 500g', 260000.00, 245000.00, 70.00, 'HACCP', 'Hệ Thống Bò Thịt VFT Feedlot', true, true, 'Thịt bò tơ mềm mọng nước, vân mỡ mảnh ngọt bùi, kiểm định an toàn vệ sinh chuẩn HACCP.', '2026-10-25 11:41:05.361365+00', '2026-10-25 11:41:05.361365+00');
INSERT INTO public.products VALUES (23, 3, 'Nạc Dăm Heo Thảo Mộc Thơm Ngon', 'nac-dam-heo-thao-moc', '/images/products/pork.svg', '[]', 'Kg', 'Khay 500g', 138000.00, 128000.00, 85.00, 'VfSC', 'Trang Trại Heo Thảo Mộc VFT', false, true, 'Nạc dăm mềm giòn không khô xác, thích hợp làm các món rim mặn ngọt, nướng xiên que.', '2026-10-25 11:41:05.361365+00', '2026-10-25 11:41:05.361365+00');
INSERT INTO public.products VALUES (24, 3, 'Sườn Non Heo Thảo Mộc VFT', 'suon-non-heo-thao-moc-vft', '/images/products/pork.svg', '[]', 'Kg', 'Khay 500g', 165000.00, 155000.00, 80.00, 'VfSC', 'Trang Trại Heo Thảo Mộc VFT', true, false, 'Sườn cọng nhỏ dẹt nhiều sụn non giòn sần sật, nước hầm ngọt thanh tự nhiên không ngấy.', '2026-10-25 11:41:05.361365+00', '2026-10-25 11:41:05.361365+00');
INSERT INTO public.products VALUES (25, 3, 'Bắp Bò Hoa Tươi Giòn Ngọt', 'bap-bo-hoa-tuoi-gion-ngot', '/images/products/beef.svg', '[]', 'Kg', 'Khay 400g', 235000.00, 220000.00, 65.00, 'HACCP', 'Hệ Thống Bò Thịt VFT Feedlot', true, false, 'Bắp hoa gân trong giòn sần sật, món khoái khẩu cho các món lẩu, luộc mắm gừng hoặc bóp thấu.', '2026-10-25 11:41:05.361365+00', '2026-10-25 11:41:05.361365+00');
INSERT INTO public.products VALUES (26, 3, 'Gà Đồi Tiên Yên Thả Vườn', 'ga-doi-tien-yen-tha-vuon', 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=600&q=80', '[]', 'Con', 'Con 1.4kg', 185000.00, 175000.00, 55.00, 'VietGAP', 'HTX Chăn Nuôi Gà Tiên Yên', true, true, 'Gà thả đồi tự nhiên thịt săn chắc da vàng giòn rụm, luộc hay nướng muối ớt đều thơm nức mũi.', '2026-10-25 11:41:05.361365+00', '2026-10-25 11:41:05.361365+00');
INSERT INTO public.products VALUES (27, 3, 'Đùi Gà Mía Thả Vườn Tươi Sạch', 'dui-ga-mia-tha-vuon-tuoi-sach', 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=600&q=80', '[]', 'Khay', 'Khay 500g', 68000.00, 62000.00, 110.00, 'VietGAP', 'Trang Trại Gà Đồi Sơn Tây', false, true, 'Thịt đùi gà chắc nịch ngọt đậm đà, đóng khay hút chân không sạch sẽ tiện chế biến nhanh.', '2026-10-25 11:41:05.361365+00', '2026-10-25 11:41:05.361365+00');
INSERT INTO public.products VALUES (28, 3, 'Vịt Cỏ Vân Đình Sạch Tươi', 'vit-co-van-dinh-sach-tuoi', 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=600&q=80', '[]', 'Con', 'Con 1.8kg', 195000.00, 180000.00, 45.00, 'VietGAP', 'HTX Thủy Cầm Ứng Hòa', false, false, 'Vịt cỏ thả đồng ăn lúa tự nhiên, thịt nạc thơm mềm xương nhỏ, không có mùi hôi tanh.', '2026-10-25 11:41:05.361365+00', '2026-10-25 11:41:05.361365+00');
INSERT INTO public.products VALUES (29, 3, 'Thịt Bê Non Mộc Châu Tươi Mềm', 'thit-be-non-moc-chau-tuoi-mem', '/images/products/beef.svg', '[]', 'Kg', 'Khay 500g', 175000.00, 160000.00, 50.00, 'HACCP', 'HTX Chăn Nuôi Mộc Châu', false, false, 'Bê non ăn cỏ cao nguyên, thịt đỏ hồng ngọt lịm bì mềm mỏng, món bê xào sả ớt trứ danh.', '2026-10-25 11:41:05.361365+00', '2026-10-25 11:41:05.361365+00');
INSERT INTO public.products VALUES (30, 3, 'Giò Lụa Heo Thảo Mộc Truyền Thống', 'gio-lua-heo-thao-moc', '/images/products/pork.svg', '[]', 'Cây', 'Cây 500g', 110000.00, 99000.00, 75.00, 'HACCP', 'Xưởng Giò Chả Ước Lễ VFT', false, true, 'Giò giã tay từ thịt heo nóng thảo mộc, nêm nước mắm cốt nhĩ, không hàn the hay chất bảo quản.', '2026-10-25 11:41:05.361365+00', '2026-10-25 11:41:05.361365+00');
INSERT INTO public.products VALUES (31, 4, 'Cá Hồi Sa Pa Tươi Fillet', 'ca-hoi-sa-pa-tuoi-fillet', 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&q=80', '[]', 'Khay', 'Khay 300g', 165000.00, 150000.00, 60.00, 'VietGAP', 'Trại Cá Nước Lạnh Sa Pa', true, true, 'Cá hồi nuôi nguồn nước suối lạnh tinh khiết, thịt cam tươi vân mỡ trắng giàu Omega-3.', '2026-10-25 11:41:05.361365+00', '2026-10-25 11:41:05.361365+00');
INSERT INTO public.products VALUES (32, 4, 'Tôm Sú Sinh Thái Rừng Ngập Mặn', 'tom-su-sinh-thai-rung-ngap-man', 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=600&q=80', '[]', 'Hộp', 'Hộp 500g', 185000.00, 170000.00, 75.00, 'Organic', 'Khu Bảo Tồn Sinh Thái Cà Mau', true, true, 'Tôm sú tự nhiên ăn sinh vật phù du rừng đước, vỏ bóng đậm thịt giòn ngọt săn chắc.', '2026-10-25 11:41:05.361365+00', '2026-10-25 11:41:05.361365+00');
INSERT INTO public.products VALUES (33, 4, 'Cá Lăng Sông Đà Tươi Cắt Khúc', 'ca-lang-song-da-tuoi-cat-khuc', 'https://images.unsplash.com/photo-1534948216015-843149f72be3?w=600&q=80', '[]', 'Kg', 'Khay 1kg', 195000.00, 180000.00, 45.00, 'VietGAP', 'Hợp Tác Xã Thủy Sản Hòa Bình', true, false, 'Cá lăng dòng nước xiết không xương dăm, thịt trắng ngần béo thơm cho món chả cá Lã Vọng.', '2026-10-25 11:41:05.361365+00', '2026-10-25 11:41:05.361365+00');
INSERT INTO public.products VALUES (34, 4, 'Mực Ống Côn Đảo Cấp Đông Nhanh', 'muc-ong-con-dao-cap-dong-nhanh', 'https://images.unsplash.com/photo-1544943910-4c1dc44a0808?w=600&q=80', '[]', 'Khay', 'Khay 500g', 145000.00, 135000.00, 80.00, 'HACCP', 'Hải Đoàn Đánh Bắt Vũng Tàu', false, true, 'Mực câu đêm nhấp nháy cấp đông IQF ngay trên tàu, giữ trọn độ dày mình ngọt giòn.', '2026-10-25 11:41:05.361365+00', '2026-10-25 11:41:05.361365+00');
INSERT INTO public.products VALUES (35, 4, 'Chả Cá Thát Lát Hậu Giang Nạo Tươi', 'cha-ca-that-lat-hau-giang-nao-tuoi', 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600&q=80', '[]', 'Gói', 'Gói 400g', 115000.00, 105000.00, 90.00, 'HACCP', 'HTX Thủy Sản Hậu Giang', false, false, 'Thịt cá nạo nguyên chất 100%, quết dẻo quánh tự nhiên làm lẩu khổ qua hay canh chua cực đỉnh.', '2026-10-25 11:41:05.361365+00', '2026-10-25 11:41:05.361365+00');
INSERT INTO public.products VALUES (36, 4, 'Cá Kèo Sống Miền Tây Đậm Vị', 'ca-keo-song-mien-tay-dam-vi', 'https://images.unsplash.com/photo-1510130387422-82ebd3301c4e?w=600&q=80', '[]', 'Kg', 'Khay 500g', 95000.00, 88000.00, 70.00, 'VietGAP', 'HTX Nuôi Thủy Sản Bạc Liêu', false, false, 'Cá kèo béo bùi da trơn láng, món cá kèo kho rau răm hay nấu lá giang đậm đà hồn quê.', '2026-10-25 11:41:05.361365+00', '2026-10-25 11:41:05.361365+00');
INSERT INTO public.products VALUES (37, 4, 'Tôm Thẻ Chân Trắng VietGAP', 'tom-the-chan-trang-vietgap', 'https://images.unsplash.com/photo-1559742811-822863cb4cb0?w=600&q=80', '[]', 'Khay', 'Khay 500g', 110000.00, 99000.00, 120.00, 'VietGAP', 'Khu Nuôi Trồng Thủy Sản Sóc Trăng', false, true, 'Tôm thẻ tươi xanh óng ả, thịt ngọt giòn ráo vỏ, đạt chuẩn dư lượng kháng sinh số 0.', '2026-10-25 11:41:05.361365+00', '2026-10-25 11:41:05.361365+00');
INSERT INTO public.products VALUES (38, 4, 'Cá Bớp Biển Đảo Phú Quốc Cắt Lát', 'ca-bop-bien-dao-phu-quoc', 'https://images.unsplash.com/photo-1535400255456-984241443b29?w=600&q=80', '[]', 'Khay', 'Khay 500g', 175000.00, 160000.00, 50.00, 'HACCP', 'Vùng Biển Nuôi Đảo Phú Quốc', true, false, 'Cá bớp biển sâu thịt trắng chắc thơm ngọt, lớp mỡ dưới da béo ngậy nấu canh chua tuyệt hảo.', '2026-10-25 11:41:05.361365+00', '2026-10-25 11:41:05.361365+00');
INSERT INTO public.products VALUES (40, 4, 'Cua Biển Cà Mau Năm Căn Chắc Thịt', 'cua-bien-ca-mau-nam-can', 'https://images.unsplash.com/photo-1548811258-00ad0606bfd5?w=600&q=80', '[]', 'Con', 'Con 500g', 240000.00, 220000.00, 40.00, 'Organic', 'Vùng Đất Mũi Năm Căn Cà Mau', true, true, 'Cua yếm vuông thịt nén chặt thơm ngọt đậm đà, bao ăn từng con đổi trả trong ngày.', '2026-10-25 11:41:05.361365+00', '2026-10-25 11:41:05.361365+00');
INSERT INTO public.products VALUES (21, 3, 'Thịt Ba Chỉ Heo Thảo Mộc', 'thit-ba-chi-heo-thao-moc', '/images/products/pork.svg', '[]', 'Kg', 'Khay 500g', 145000.00, 135000.00, 94.00, 'VfSC', 'Trang Trại Heo Thảo Mộc VFT', true, true, 'Ba rọi nạc mỡ đan xen đều đặn, heo ăn cám sinh học phối trộn trà xanh và quế chi thơm lừng.', '2026-10-25 11:41:05.361365+00', '2026-10-25 11:41:05.361365+00');
INSERT INTO public.products VALUES (41, 5, 'Trứng Gà Ta Thảo Dược VFT', 'trung-ga-ta-thao-duoc-vft', 'https://images.unsplash.com/photo-1516448620398-c5f44bf9f441?w=600&q=80', '[]', 'Hộp', 'Hộp 10 quả', 45000.00, 39000.00, 220.00, 'Organic', 'Trang Trại Gia Cầm Sinh Học VFT', true, true, 'Lòng đỏ cam đậm quánh dẻo, thơm ngậy không tanh, gà đẻ trứng nuôi thức ăn thảo dược.', '2026-10-25 11:41:05.361365+00', '2026-10-25 11:41:05.361365+00');
INSERT INTO public.products VALUES (42, 5, 'Trứng Vịt Đồng Thả Tự Nhiên', 'trung-vit-dong-tha-tu-nhien', 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=600&q=80', '[]', 'Hộp', 'Hộp 10 quả', 42000.00, 38000.00, 150.00, 'VietGAP', 'HTX Vịt Cỏ Đồng Chiêm', false, false, 'Trứng vỏ xanh trắng sạch sẽ, lòng đỏ lớn béo bùi, giàu dinh dưỡng cho bữa cơm gia đình.', '2026-10-25 11:41:05.361365+00', '2026-10-25 11:41:05.361365+00');
INSERT INTO public.products VALUES (43, 5, 'Sữa Bò Tươi Thanh Trùng 100%', 'sua-bo-tuoi-thanh-trung-100', 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&q=80', '[]', 'Chai', 'Chai 900ml', 42000.00, 38000.00, 130.00, 'HACCP', 'Thảo Nguyên Sữa Mộc Châu', true, true, 'Sữa vắt từ đàn bò ăn cỏ tươi nguyên chất, thanh trùng nhiệt độ thấp giữ trọn kháng thể.', '2026-10-25 11:41:05.361365+00', '2026-10-25 11:41:05.361365+00');
INSERT INTO public.products VALUES (44, 5, 'Sữa Chua Nông Trại Ba Vì Lên Men', 'sua-chua-nong-trai-ba-vi', 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&q=80', '[]', 'Lốc', 'Lốc 4 hũ', 36000.00, 32000.00, 180.00, 'HACCP', 'Nông Trại Bò Sữa Ba Vì', false, true, 'Sữa chua men sống tự nhiên sánh mịn thơm dịu, tốt cho hệ tiêu hóa của trẻ nhỏ.', '2026-10-25 11:41:05.361365+00', '2026-10-25 11:41:05.361365+00');
INSERT INTO public.products VALUES (45, 5, 'Trứng Cút Tươi Sạch Bổ Dưỡng', 'trung-cut-tuoi-sach-bo-duong', 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=600&q=80', '[]', 'Hộp', 'Hộp 30 quả', 25000.00, 22000.00, 190.00, 'VietGAP', 'HTX Chim Cút Tiền Giang', false, false, 'Trứng cút tươi loại 1 đồng đều, thích hợp luộc chấm muối tiêu hoặc rim thịt ba chỉ.', '2026-10-25 11:41:05.361365+00', '2026-10-25 11:41:05.361365+00');
INSERT INTO public.products VALUES (46, 5, 'Sữa Đậu Nành Tươi Mầm Hữu Cơ', 'sua-dau-nanh-tuoi-mam-huu-co', 'https://images.unsplash.com/photo-1568651318287-57502bfafb2e?w=600&q=80', '[]', 'Chai', 'Chai 500ml', 22000.00, 19000.00, 140.00, 'Organic', 'Xưởng Sữa Hạt VFT Farms', false, false, 'Nấu từ hạt đậu tương giống thuần ủ mầm thanh mát, thơm ngậy tự nhiên không đường tinh luyện.', '2026-10-25 11:41:05.361365+00', '2026-10-25 11:41:05.361365+00');
INSERT INTO public.products VALUES (47, 5, 'Bơ Lạt Tự Nhiên Thanh Trùng', 'bo-lat-tu-nhien-thanh-trung', 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=600&q=80', '[]', 'Hộp', 'Hộp 200g', 58000.00, 52000.00, 85.00, 'HACCP', 'Trại Bò Sữa Đà Lạt Milk', false, false, 'Tách từ váng sữa bò tươi thanh trùng, mùi thơm béo ngậy tinh khiết dùng làm bánh xào nấu.', '2026-10-25 11:41:05.361365+00', '2026-10-25 11:41:05.361365+00');
INSERT INTO public.products VALUES (48, 5, 'Phô Mai Tươi Nông Trại Đà Lạt', 'pho-mai-tuoi-nong-trai-da-lat', 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=600&q=80', '[]', 'Hũ', 'Hũ 150g', 72000.00, 65000.00, 70.00, 'HACCP', 'Trại Bò Sữa Đà Lạt Milk', true, false, 'Phô mai tươi mềm mướt giàu protein và canxi sinh học, tuyệt phẩm ăn cùng bánh mì trái cây.', '2026-10-25 11:41:05.361365+00', '2026-10-25 11:41:05.361365+00');
INSERT INTO public.products VALUES (49, 5, 'Trứng Gà So Soi Đèn Chọn Lọc', 'trung-ga-so-soi-den-chon-loc', 'https://images.unsplash.com/photo-1569288052389-dac9b01c9c05?w=600&q=80', '[]', 'Hộp', 'Hộp 10 quả', 48000.00, 42000.00, 160.00, 'VietGAP', 'HTX Gia Cầm Đan Phượng', false, true, 'Trứng lứa đầu của gà tơ nhỏ nhắn nhưng đậm đặc dưỡng chất, bồi bổ phụ nữ sau sinh và trẻ em.', '2026-10-25 11:41:05.361365+00', '2026-10-25 11:41:05.361365+00');
INSERT INTO public.products VALUES (50, 5, 'Sữa Hạt Sen Tươi Dinh Dưỡng VFT', 'sua-hat-sen-tuoi-dinh-duong', 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=600&q=80', '[]', 'Chai', 'Chai 330ml', 28000.00, 25000.00, 110.00, 'Organic', 'Xưởng Sữa Hạt VFT Farms', false, false, 'Nấu từ hạt sen tươi Đồng Tháp sánh mịn thơm thoảng hương sen, giúp an thần ngủ ngon giấc.', '2026-10-25 11:41:05.361365+00', '2026-10-25 11:41:05.361365+00');
INSERT INTO public.products VALUES (51, 6, 'Gạo Ông Cua Hữu Cơ ST25 Chuẩn Vị', 'gao-ong-cua-huu-co-st25', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&q=80', '[]', 'Túi', 'Túi 5kg', 195000.00, 185000.00, 250.00, 'Organic', 'Vùng Lúa Tôm Sóc Trăng', true, true, 'Gạo ngon nhất thế giới hạt dài trắng trong, cơm dẻo mềm thơm ngát mùi lá dứa tự nhiên.', '2026-10-25 11:41:05.361365+00', '2026-10-25 11:41:05.361365+00');
INSERT INTO public.products VALUES (52, 6, 'Gạo Lứt Tím Than Dinh Dưỡng Cao', 'gao-lut-tim-than-dinh-duong', 'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=600&q=80', '[]', 'Túi', 'Túi 2kg', 88000.00, 79000.00, 140.00, 'Organic', 'Cánh Đồng Sinh Thái Điện Biên', true, false, 'Giàu anthocyanin và vitamin nhóm B, hỗ trợ ăn kiêng tiểu đường thanh lọc cơ thể bền vững.', '2026-10-25 11:41:05.361365+00', '2026-10-25 11:41:05.361365+00');
INSERT INTO public.products VALUES (53, 6, 'Gạo Nếp Cái Hoa Vàng Hải Dương', 'gao-nep-cai-hoa-vang', 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=600&q=80', '[]', 'Túi', 'Túi 3kg', 115000.00, 105000.00, 120.00, 'VietGAP', 'HTX Nếp Kinh Môn Hải Dương', false, true, 'Hạt tròn mẩy đều tăm tắp, đồ xôi dẻo quánh thơm nức mũi cả ngõ xóm, làm bánh chưng ngày tết.', '2026-10-25 11:41:05.361365+00', '2026-10-25 11:41:05.361365+00');
INSERT INTO public.products VALUES (54, 6, 'Đậu Xanh Hạt Tiêu Hữu Cơ VFT', 'dau-xanh-hat-tieu-huu-co', 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=600&q=80', '[]', 'Gói', 'Gói 500g', 38000.00, 34000.00, 130.00, 'Organic', 'Cánh Đồng Hữu Cơ VFT Ninh Thuận', false, false, 'Hạt đậu nhỏ đậm vị thơm bùi bở tơi, không đánh bóng hóa chất, nấu chè hay làm giá đỗ cực tốt.', '2026-10-25 11:41:05.361365+00', '2026-10-25 11:41:05.361365+00');
INSERT INTO public.products VALUES (55, 6, 'Đậu Đen Xanh Lòng Bản Địa', 'dau-den-xanh-long-ban-dia', 'https://images.unsplash.com/photo-1551462147-37885acc36f1?w=600&q=80', '[]', 'Gói', 'Gói 500g', 42000.00, 36000.00, 145.00, 'Organic', 'HTX Nông Dân Miền Tây', false, true, 'Đậu đen xanh lòng giống cổ truyền hạt căng mọng, nấu nước thanh lọc gan mát thận tuyệt vời.', '2026-10-25 11:41:05.361365+00', '2026-10-25 11:41:05.361365+00');
INSERT INTO public.products VALUES (56, 6, 'Mè Đen Sẻ Ép Sạch Thuần Nông', 'me-den-se-ep-sach-thuan-nong', 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=600&q=80', '[]', 'Gói', 'Gói 400g', 45000.00, 39000.00, 110.00, 'Organic', 'Nông Trại Hạt Thuần Quảng Nam', false, false, 'Hạt mè nhỏ thơm nồng nàn, hàm lượng dầu tốt và canxi thực vật cao nhất trong các loại hạt.', '2026-10-25 11:41:05.361365+00', '2026-10-25 11:41:05.361365+00');
INSERT INTO public.products VALUES (57, 6, 'Yến Mạch Cán Vỡ Nguyên Cám', 'yen-mach-can-vo-nguyen-cam', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&q=80', '[]', 'Hũ', 'Hũ 800g', 75000.00, 68000.00, 160.00, 'HACCP', 'Xưởng Ngũ Cốc VFT Organic', false, false, 'Yến mạch nhập khẩu tinh tuyển giàu beta-glucan hòa tan, bữa sáng lý tưởng cho người bận rộn.', '2026-10-25 11:41:05.361365+00', '2026-10-25 11:41:05.361365+00');
INSERT INTO public.products VALUES (58, 6, 'Hạt Quinoa Diêm Mạch Hữu Cơ', 'hat-quinoa-diem-mach-huu-co', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&q=80', '[]', 'Túi', 'Túi 500g', 125000.00, 115000.00, 90.00, 'Organic', 'VFT Health Food Center', false, false, 'Hạt diêm mạch ba màu cân đối đủ 9 axit amin thiết yếu, thay thế tinh bột nhanh hoàn hảo.', '2026-10-25 11:41:05.361365+00', '2026-10-25 11:41:05.361365+00');
INSERT INTO public.products VALUES (59, 6, 'Đậu Nành Non Hữu Cơ Không Biến Đổi', 'dau-nanh-non-huu-co', 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=600&q=80', '[]', 'Gói', 'Gói 500g', 35000.00, 29000.00, 175.00, 'Organic', 'HTX Nông Nghiệp Cao Bằng', false, false, 'Giống đậu bản địa non GMO hạt tròn vàng óng, làm sữa đậu nành hay ủ đậu hũ thơm béo tự nhiên.', '2026-10-25 11:41:05.361365+00', '2026-10-25 11:41:05.361365+00');
INSERT INTO public.products VALUES (60, 6, 'Bột Mầm Ngũ Cốc 12 Loại Hạt', 'bot-mam-ngu-coc-12-loai-hat', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&q=80', '[]', 'Hộp', 'Hộp 500g', 135000.00, 120000.00, 105.00, 'HACCP', 'Xưởng Ngũ Cốc VFT Organic', true, true, 'Rang sấy công nghệ lạnh từ 12 loại hạt ngâm mầm dinh dưỡng, bổ sung năng lượng thuần tự nhiên.', '2026-10-25 11:41:05.361365+00', '2026-10-25 11:41:05.361365+00');
INSERT INTO public.products VALUES (61, 7, 'Nấm Đông Cô Tươi Đà Lạt', 'nam-dong-co-tuoi-da-lat', 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=600&q=80', '[]', 'Khay', 'Khay 300g', 48000.00, 42000.00, 115.00, 'VietGAP', 'Trang Trại Nấm Sạch Lạc Dương', true, true, 'Mũ nấm dày dặn hình mai rùa, thịt nấm dai ngọt thơm mùi gỗ tự nhiên, bồi bổ khí huyết.', '2026-10-25 11:41:05.361365+00', '2026-10-25 11:41:05.361365+00');
INSERT INTO public.products VALUES (62, 7, 'Nấm Đùi Gà Baby Giòn Ngọt', 'nam-dui-ga-baby-gion-ngot', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80', '[]', 'Khay', 'Khay 300g', 42000.00, 38000.00, 130.00, 'VietGAP', 'Nhà Nấm Sinh Học VFT Đà Lạt', false, true, 'Nấm thân mập trắng ngần, vị giòn dai ngọt thanh như thịt gà, ăn lẩu hay kho tiêu cực ngon.', '2026-10-25 11:41:05.361365+00', '2026-10-25 11:41:05.361365+00');
INSERT INTO public.products VALUES (63, 7, 'Nấm Mối Đen Tươi Sinh Học', 'nam-moi-den-tuoi-sinh-hoc', 'https://images.unsplash.com/photo-1511253819057-154911df9603?w=600&q=80', '[]', 'Khay', 'Khay 250g', 85000.00, 78000.00, 70.00, 'Organic', 'Trại Nấm Cao Cấp Lâm Đồng', true, false, 'Được mệnh danh vua của các loại nấm tươi, ngọt đậm đà giàu dinh dưỡng và polysaccarit.', '2026-10-25 11:41:05.361365+00', '2026-10-25 11:41:05.361365+00');
INSERT INTO public.products VALUES (64, 7, 'Nấm Rơm Tươi Quê Chọn Lọc', 'nam-rom-tuoi-que-chon-loc', 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80', '[]', 'Khay', 'Khay 300g', 39000.00, 35000.00, 100.00, 'VietGAP', 'Làng Nghề Nấm Rơm Thốt Nốt', false, false, 'Búp nấm tròn đen chắc nịch, nấu canh hay xào thịt giữ nguyên hương vị mộc mạc đồng quê.', '2026-10-25 11:41:05.361365+00', '2026-10-25 11:41:05.361365+00');
INSERT INTO public.products VALUES (66, 7, 'Nấm Linh Chi Đỏ Thái Lát', 'nam-linh-chi-do-thai-lat', 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=600&q=80', '[]', 'Gói', 'Gói 250g', 220000.00, 199000.00, 60.00, 'Organic', 'Trang Trại Dược Liệu Kon Tum', true, false, 'Tai nấm đỏ đều mặt phấn dày, hãm trà uống hằng ngày hạ mỡ máu và an thần dưỡng tâm.', '2026-10-25 11:41:05.361365+00', '2026-10-25 11:41:05.361365+00');
INSERT INTO public.products VALUES (67, 7, 'Mộc Nhĩ Đen Rừng Tự Nhiên Cắt Chân', 'moc-nhi-den-rung', 'https://images.unsplash.com/photo-1511253819057-154911df9603?w=600&q=80', '[]', 'Gói', 'Gói 200g', 55000.00, 48000.00, 140.00, 'VietGAP', 'Vùng Dược Liệu Sơn La', false, false, 'Cánh nấm đen dày giòn sần sật, phơi khô tự nhiên đã sơ chế sạch chân nấm tiện sử dụng.', '2026-10-25 11:41:05.361365+00', '2026-10-25 11:41:05.361365+00');
INSERT INTO public.products VALUES (68, 7, 'Nấm Hương Rừng Khô Tây Bắc', 'nam-huong-rung-kho-tay-bac', 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=600&q=80', '[]', 'Túi', 'Túi 200g', 98000.00, 89000.00, 85.00, 'VietGAP', 'HTX Nông Lâm Sản Sa Pa', false, true, 'Hương thơm nức nở đặc trưng của nấm rừng cổ thụ, gia vị vàng cho các món canh bóng ngày hội.', '2026-10-25 11:41:05.361365+00', '2026-10-25 11:41:05.361365+00');
INSERT INTO public.products VALUES (69, 7, 'Sâm Đương Quy Tươi Bát Xát', 'sam-duong-quy-tuoi-bat-xat', 'https://images.unsplash.com/photo-1544986581-efac024faf62?w=600&q=80', '[]', 'Kg', 'Củ 500g', 140000.00, 125000.00, 40.00, 'Organic', 'Vùng Dược Liệu Bát Xát Lào Cai', false, false, 'Củ sâm đương quy thơm nồng hương thảo dược vùng cao, hầm gà hay ngâm mật ong cực bổ.', '2026-10-25 11:41:05.361365+00', '2026-10-25 11:41:05.361365+00');
INSERT INTO public.products VALUES (70, 7, 'Táo Đỏ Tân Cương Sấy Khô Thảo Dược', 'tao-do-tan-cuong-say-kho', 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=600&q=80', '[]', 'Gói', 'Gói 500g', 95000.00, 85000.00, 110.00, 'HACCP', 'VFT Health Care Center', false, false, 'Quả táo to cùi dày hạt nhỏ ngọt lịm tự nhiên, vị thuốc bổ huyết dưỡng nhan cho phái đẹp.', '2026-10-25 11:41:05.361365+00', '2026-10-25 11:41:05.361365+00');
INSERT INTO public.products VALUES (71, 8, 'Mật Ong Hoa Nhãn Hưng Yên Nguyên Chất', 'mat-ong-hoa-nhan-hung-yen', 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&q=80', '[]', 'Chai', 'Chai 500ml', 165000.00, 145000.00, 130.00, 'VietGAP', 'Làng Nuôi Ong Sông Hồng', true, true, 'Màu vàng óng hổ phách sánh mịn, hương hoa nhãn ngát thơm vị ngọt sắc không khé cổ.', '2026-10-25 11:41:05.361365+00', '2026-10-25 11:41:05.361365+00');
INSERT INTO public.products VALUES (72, 8, 'Mật Ong Bạc Hà Mèo Vạc Hà Giang', 'mat-ong-bac-ha-meo-vac', 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&q=80', '[]', 'Chai', 'Chai 500ml', 280000.00, 255000.00, 65.00, 'Organic', 'Cao Nguyên Đá Đồng Văn', true, false, 'Màu xanh chanh sóng sánh quý hiếm, vị thơm the mát dịu êm đặc sản nức danh núi rừng.', '2026-10-25 11:41:05.361365+00', '2026-10-25 11:41:05.361365+00');
INSERT INTO public.products VALUES (73, 8, 'Trà Shan Tuyết Cổ Thụ Hà Giang', 'tra-shan-tuyet-co-thu-ha-giang', 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&q=80', '[]', 'Hộp', 'Hộp 200g', 210000.00, 190000.00, 75.00, 'Organic', 'Rừng Chè Cổ Thụ Hoàng Su Phì', true, true, 'Búp chè phủ lớp lông tuyết bạc trắng, nước vàng mật ong tiền chát nhẹ hậu ngọt sâu lắng.', '2026-10-25 11:41:05.361365+00', '2026-10-25 11:41:05.361365+00');
INSERT INTO public.products VALUES (74, 8, 'Trà Oolong Cao Cấp Mộc Châu', 'tra-oolong-cao-cap-moc-chau', 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=600&q=80', '[]', 'Hộp', 'Hộp 250g', 185000.00, 168000.00, 90.00, 'VietGAP', 'Đồi Chè Ô Long Mộc Châu', false, true, 'Viên chè cuộn tròn bóng bẩy, nước xanh trong sánh thơm hương hoa mộc lan thanh thoát.', '2026-10-25 11:41:05.361365+00', '2026-10-25 11:41:05.361365+00');
INSERT INTO public.products VALUES (76, 8, 'Trà Sen Tây Hồ Ướp Hoa Thật', 'tra-sen-tay-ho-uop-hoa-that', 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&q=80', '[]', 'Hộp', 'Hộp 100g', 320000.00, 290000.00, 45.00, 'HACCP', 'Nghệ Nhân Trà Sen Quảng An', true, false, 'Chè Tân Cương ướp 7 lần gạo sen Bách Diệp Tây Hồ, tinh hoa ẩm thực đỉnh cao xứ Kinh Kỳ.', '2026-10-25 11:41:05.361365+00', '2026-10-25 11:41:05.361365+00');
INSERT INTO public.products VALUES (77, 8, 'Phấn Hoa Rừng Tự Nhiên Bồi Bổ', 'phan-hoa-rung-tu-nhien', 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&q=80', '[]', 'Hũ', 'Hũ 300g', 115000.00, 99000.00, 95.00, 'VietGAP', 'HTX Nuôi Ong Đắk Lắk', false, false, 'Hạt phấn vàng óng thu gom từ muôn hoa rừng đại ngàn, giàu đạm và enzyme hỗ trợ tiêu hóa.', '2026-10-25 11:41:05.361365+00', '2026-10-25 11:41:05.361365+00');
INSERT INTO public.products VALUES (78, 8, 'Sữa Ong Chúa Tươi Cao Cấp', 'sua-ong-chua-tuoi-cao-cap', 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&q=80', '[]', 'Hũ', 'Hũ 100g', 175000.00, 155000.00, 50.00, 'HACCP', 'HTX Nuôi Ong Lâm Đồng', false, false, 'Dạng kem sữa sánh mịn màu vàng nhạt, bí quyết trẻ hóa làn da và tăng cường sinh lực phái đẹp.', '2026-10-25 11:41:05.361365+00', '2026-10-25 11:41:05.361365+00');
INSERT INTO public.products VALUES (79, 8, 'Trà Thảo Mộc Cung Đình Huế', 'tra-thao-moc-cung-dinh-hue', 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=600&q=80', '[]', 'Hộp', 'Hộp 250g', 95000.00, 85000.00, 110.00, 'VietGAP', 'Xưởng Trà Cung Đình Cố Đô', false, true, 'Phối trộn 16 vị thảo dược quý atiso, hoa nhài, cam thảo, cỏ ngọt, uống nóng lạnh đều sảng khoái.', '2026-10-25 11:41:05.361365+00', '2026-10-25 11:41:05.361365+00');
INSERT INTO public.products VALUES (80, 8, 'Trà Atiso Túi Lọc Đà Lạt', 'tra-atiso-tui-loc-da-lat', 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&q=80', '[]', 'Hộp', 'Hộp 40 túi', 65000.00, 58000.00, 150.00, 'VietGAP', 'Nông Trại Dược Liệu Đà Lạt', false, false, 'Chiết xuất từ hoa và thân atiso tươi mát gan lợi mật, dạng túi lọc tiện pha cho dân văn phòng.', '2026-10-25 11:41:05.361365+00', '2026-10-25 11:41:05.361365+00');
INSERT INTO public.products VALUES (65, 7, 'Đông Trùng Hạ Thảo Tươi Nuôi Cấy', 'dong-trung-ha-thao-tuoi', 'https://images.unsplash.com/photo-1544986581-efac024faf62?w=600&q=80', '[]', 'Hộp', 'Hộp 100g', 195000.00, 175000.00, 49.00, 'HACCP', 'Viện Nghiên Cứu Vi Sinh VFT', true, true, 'Sợi nấm vàng cam tươi rói, hàm lượng cordycepin và adenosine tối ưu giúp tăng cường thể lực.', '2026-10-25 11:41:05.361365+00', '2026-10-25 11:41:05.361365+00');
INSERT INTO public.products VALUES (81, 9, 'Nước Mắm Truyền Thống Phú Quốc 40 Đạm', 'nuoc-mam-truyen-thong-phu-quoc', 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&q=80', '[]', 'Chai', 'Chai 500ml', 115000.00, 99000.00, 140.00, 'HACCP', 'Nhà Thùng Nước Mắm Phú Quốc', true, true, 'Ủ chượp cá cơm than trong thùng gỗ bời lời trên 12 tháng, màu cánh gián thơm ngào ngạt hậu ngọt đạm.', '2026-10-25 11:41:05.361365+00', '2026-10-25 11:41:05.361365+00');
INSERT INTO public.products VALUES (82, 9, 'Tiêu Đen Tiên Phước Hạt Chắc Cay Nồng', 'tieu-den-tien-phuoc', 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&q=80', '[]', 'Hũ', 'Hũ 200g', 65000.00, 58000.00, 160.00, 'VietGAP', 'HTX Hồ Tiêu Tiên Phước Quảng Nam', false, true, 'Hạt tiêu mẩy chắc đen giòn, vị cay nồng ấm nức danh không dùng chất chống mốc.', '2026-10-25 11:41:05.361365+00', '2026-10-25 11:41:05.361365+00');
INSERT INTO public.products VALUES (83, 9, 'Muối Hầm Tự Nhiên Sa Huỳnh', 'muoi-ham-tu-nhien-sa-huynh', 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&q=80', '[]', 'Hũ', 'Hũ 500g', 35000.00, 29000.00, 200.00, 'Organic', 'Cánh Đồng Muối Sa Huỳnh Quảng Ngãi', false, false, 'Nung trong nồi đất nung theo bí quyết cổ truyền, hạt muối mịn màng vị mặn dịu hậu ngọt lành tính.', '2026-10-25 11:41:05.361365+00', '2026-10-25 11:41:05.361365+00');
INSERT INTO public.products VALUES (84, 9, 'Dầu Lạc Ép Lạnh Nguyên Chất VFT', 'dau-lac-ep-lanh-nguyen-chat', 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&q=80', '[]', 'Chai', 'Chai 1 lít', 135000.00, 120000.00, 85.00, 'Organic', 'Xưởng Ép Dầu Thực Vật VFT', true, false, 'Ép cơ học không gia nhiệt từ hạt đậu phộng sẻ Tây Nguyên, vàng sóng sánh thơm ngậy béo bùi.', '2026-10-25 11:41:05.361365+00', '2026-10-25 11:41:05.361365+00');
INSERT INTO public.products VALUES (85, 9, 'Dầu Mè Đen Ép Sống Thơm Lừng', 'dau-me-den-ep-song', 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&q=80', '[]', 'Chai', 'Chai 250ml', 88000.00, 78000.00, 95.00, 'Organic', 'Xưởng Ép Dầu Thực Vật VFT', false, false, 'Dầu mè đen nguyên chất ép sống giàu sesamol chống lão hóa, tuyệt vời để trộn salad ăn dặm.', '2026-10-25 11:41:05.361365+00', '2026-10-25 11:41:05.361365+00');
INSERT INTO public.products VALUES (86, 9, 'Hạt Điều Bình Phước Rang Muối Vỏ Lụa', 'hat-dieu-binh-phuoc-rang-muoi', 'https://images.unsplash.com/photo-1509912760195-263d5ea7e305?w=600&q=80', '[]', 'Hộp', 'Hộp 500g', 145000.00, 130000.00, 110.00, 'HACCP', 'HTX Nông Sản Bình Phước', true, true, 'Hạt điều cùi dày giòn rụm béo ngậy, giữ lớp vỏ lụa rang củi giữ nguyên độ bùi tự nhiên.', '2026-10-25 11:41:05.361365+00', '2026-10-25 11:41:05.361365+00');
INSERT INTO public.products VALUES (87, 9, 'Mắc Ca Tây Nguyên Nứt Vỏ Tự Nhiên', 'mac-ca-tay-nguyen-nut-vo', 'https://images.unsplash.com/photo-1509912760195-263d5ea7e305?w=600&q=80', '[]', 'Hộp', 'Hộp 500g', 165000.00, 149000.00, 80.00, 'VietGAP', 'Trang Trại Macca Đắk Nông', true, false, 'Hạt mắc ca sấy nứt vỏ loại VIP, nhân trắng tròn béo ngọt bùi bùi như bơ sữa hảo hạng.', '2026-10-25 11:41:05.361365+00', '2026-10-25 11:41:05.361365+00');
INSERT INTO public.products VALUES (88, 9, 'Xoài Sấy Dẻo Ít Đường Cam Ranh', 'xoai-say-deo-it-duong', 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=600&q=80', '[]', 'Túi', 'Túi 250g', 75000.00, 68000.00, 120.00, 'HACCP', 'Xưởng Chế Biến Trái Cây VFT', false, true, 'Từng lát xoài vàng óng dẻo mềm chua ngọt quyến rũ, công nghệ sấy lạnh giữ 95% dưỡng chất.', '2026-10-25 11:41:05.361365+00', '2026-10-25 11:41:05.361365+00');
INSERT INTO public.products VALUES (89, 9, 'Chuối Tiêu Sấy Dẻo Mật Ong VFT', 'chuoi-tieu-say-deo-mat-ong', 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&q=80', '[]', 'Túi', 'Túi 300g', 55000.00, 48000.00, 140.00, 'VietGAP', 'Xưởng Chế Biến Trái Cây VFT', false, false, 'Chuối chín cây sấy kết hợp mật ong hoa nhãn, dẻo ngọt bùi tự nhiên ăn vặt lành mạnh cho cả nhà.', '2026-10-25 11:41:05.361365+00', '2026-10-25 11:41:05.361365+00');
INSERT INTO public.products VALUES (90, 9, 'Bún Khô Hữu Cơ Sợi Tự Nhiên', 'bun-kho-huu-co-soi-tu-nhien', 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&q=80', '[]', 'Gói', 'Gói 500g', 42000.00, 36000.00, 170.00, 'Organic', 'Làng Nghề Bún Khô Cổ Lễ', false, false, 'Làm từ gạo hữu cơ ST25 nước sạch, sợi bún dẻo dai nấu không nát không chua không hàn the.', '2026-10-25 11:41:05.361365+00', '2026-10-25 11:41:05.361365+00');
INSERT INTO public.products VALUES (91, 10, 'Men Vi Sinh VFT Bio-Grow Kích Rễ', 'men-vi-sinh-vft-bio-grow', 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=600&q=80', '[]', 'Chai', 'Chai 1 lít', 185000.00, 165000.00, 120.00, 'Organic', 'Trung Tâm CNSH VFT Farms', true, true, 'Men vi sinh quang dưỡng và nấm cộng sinh rễ, kích rễ bung chồi xanh lá cực mạnh.', '2026-10-25 11:41:05.361365+00', '2026-10-25 11:41:05.361365+00');
INSERT INTO public.products VALUES (92, 10, 'Men Vi Sinh Cải Tạo Đất VFT Bio-Soil', 'men-vi-sinh-cai-tao-dat-bio-soil', 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=600&q=80', '[]', 'Chai', 'Chai 1 lít', 195000.00, 175000.00, 95.00, 'Organic', 'Trung Tâm CNSH VFT Farms', true, false, 'Phân giải độc chất phèn mặn, hạ độ chua và tái tạo hệ vi sinh vật có lợi cho đất trồng trọt.', '2026-10-25 11:41:05.361365+00', '2026-10-25 11:41:05.361365+00');
INSERT INTO public.products VALUES (93, 10, 'Dịch Trùn Quế Thủy Phân Đậm Đặc', 'dich-trun-que-thuy-phan', 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=600&q=80', '[]', 'Can', 'Can 2 lít', 160000.00, 145000.00, 80.00, 'Organic', 'Trang Trại Trùn Quế Củ Chi', false, true, 'Giàu axit amin tự nhiên cây hấp thụ tức thì qua lá, dưỡng hoa bền màu đậu trái sai trĩu cành.', '2026-10-25 11:41:05.361365+00', '2026-10-25 11:41:05.361365+00');
INSERT INTO public.products VALUES (94, 10, 'Phân Trùn Quế Hữu Cơ Cao Cấp', 'phan-trun-que-huu-co-cao-cap', 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80', '[]', 'Bao', 'Bao 5kg', 75000.00, 68000.00, 160.00, 'Organic', 'Trang Trại Trùn Quế Củ Chi', false, true, 'Phân hữu cơ vi sinh sạch 100% không mùi hôi, cung cấp dinh dưỡng bền bỉ cho rau củ quả hoa kiểng.', '2026-10-25 11:41:05.361365+00', '2026-10-25 11:41:05.361365+00');
INSERT INTO public.products VALUES (95, 10, 'Đất Sạch Hữu Cơ Vi Sinh VFT Soil', 'dat-sach-huu-co-vi-sinh-vft-soil', 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80', '[]', 'Bao', 'Bao 20dm3', 65000.00, 58000.00, 190.00, 'Organic', 'Xưởng Giá Thể Nông Nghiệp VFT', true, false, 'Trộn sẵn xơ dừa, tro trấu và phân trùn quế vi sinh, trồng ngay không cần phối trộn thêm.', '2026-10-25 11:41:05.361365+00', '2026-10-25 11:41:05.361365+00');
INSERT INTO public.products VALUES (96, 10, 'Hạt Giống Xà Lách Lô Lô Xanh F1', 'hat-giong-xa-lach-lo-lo-xanh', 'https://images.unsplash.com/photo-1592417817098-8f3d6910985c?w=600&q=80', '[]', 'Gói', 'Gói 2g', 25000.00, 20000.00, 220.00, 'VietGAP', 'Viện Giống Cây Trồng Nhiệt Đới', false, false, 'Tỉ lệ nảy mầm 92%+, búp xòe tán rộng kháng nhiệt tốt, thu hoạch sau 35 ngày gieo trồng.', '2026-10-25 11:41:05.361365+00', '2026-10-25 11:41:05.361365+00');
INSERT INTO public.products VALUES (97, 10, 'Hạt Giống Cải Bẹ Xanh Mỡ Dễ Trồng', 'hat-giong-cai-be-xanh-mo', 'https://images.unsplash.com/photo-1592417817098-8f3d6910985c?w=600&q=80', '[]', 'Gói', 'Gói 5g', 22000.00, 18000.00, 240.00, 'VietGAP', 'Viện Giống Cây Trồng Nhiệt Đới', false, false, 'Giống thuần sinh trưởng khỏe ít sâu bệnh, cọng dày giòn ngọt thích hợp trồng thùng xốp sân thượng.', '2026-10-25 11:41:05.361365+00', '2026-10-25 11:41:05.361365+00');
INSERT INTO public.products VALUES (98, 10, 'Hạt Giống Cà Chua Bi F1 Siêu Trái', 'hat-giong-ca-chua-bi-f1', 'https://images.unsplash.com/photo-1592417817098-8f3d6910985c?w=600&q=80', '[]', 'Gói', 'Gói 1g', 28000.00, 24000.00, 200.00, 'VietGAP', 'Viện Giống Cây Trồng Nhiệt Đới', false, false, 'Cây phân nhánh chùm trĩu quả chín đỏ mọng, vị ngọt thanh tự nhiên rất thích hợp ban công phố.', '2026-10-25 11:41:05.361365+00', '2026-10-25 11:41:05.361365+00');
INSERT INTO public.products VALUES (99, 10, 'Dụng Cụ Làm Vườn Mini Cầm Tay', 'dung-cu-lam-vuon-mini', 'https://images.unsplash.com/photo-1617576683096-00fc8eecb3af?w=600&q=80', '[]', 'Bộ', 'Bộ 3 món', 85000.00, 75000.00, 110.00, 'HACCP', 'Xưởng Nông Cụ VFT Home Garden', false, false, 'Gồm xẻng xúc đất, cào xới và cấy cây bằng thép sơn tĩnh điện chống rỉ sét, cán gỗ êm tay.', '2026-10-25 11:41:05.361365+00', '2026-10-25 11:41:05.361365+00');
INSERT INTO public.products VALUES (100, 10, 'Bình Xịt Phun Sương Áp Suất Cao 2L', 'binh-xit-phun-suong-ap-suat-2l', 'https://images.unsplash.com/photo-1584483766114-2cea6facdf57?w=600&q=80', '[]', 'Cái', 'Bình 2L', 95000.00, 85000.00, 130.00, 'VietGAP', 'Xưởng Nông Cụ VFT Home Garden', true, false, 'Nhựa ABS bền bỉ đầu vòi đồng điều chỉnh tia phun tia sương, tiện tưới cây và xịt men vi sinh.', '2026-10-25 11:41:05.361365+00', '2026-10-25 11:41:05.361365+00');


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.users VALUES (8, 'Nguyễn Minh Anh', 'demo.user01@example.test', '0988776655', '$2b$10$pGTM21J1IFSFUuA0Q2K/mOMYKmwnGCFSSW54VrFxFjxEv3Im.V7QG', 'CUSTOMER', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb', true, '2026-10-22 07:09:17.842586+00', '2026-10-22 10:51:14.157844+00');
INSERT INTO public.users VALUES (54, 'Trần Văn Nhân Viên Kho', 'staff_created_1792995517926@vftfarms.vn', '0977112233', '$2b$10$OG7ibmojvISUysFolY5/Hu/oNqjfK828NtH3WjL8bgOZzKnVycCl.', 'STAFF', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80', true, '2026-10-26 06:18:37.998097+00', '2026-10-26 06:18:37.998097+00');
INSERT INTO public.users VALUES (53, 'Nguyễn Khách Hàng Mới', 'customer_test_1792995517603@example.test', '0912345678', '$2b$10$kispYwGDib7WZWXIbIpM2u/aSQCIQqM6dxkqVZLC6TKnnWA2btaLm', 'STAFF', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80', true, '2026-10-26 06:18:37.753742+00', '2026-10-26 06:18:38.006548+00');
INSERT INTO public.users VALUES (6, 'Phan Thị Mai', 'staff02@example.test', '0920000002', '$2b$10$WPIRd5hcfWw7TiM8e3YMK.CGtYwD7Jpgc355Y13pFwYtJ4mA6caIu', 'STAFF', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80', true, '2026-10-22 07:09:17.842586+00', '2026-10-26 06:21:22.345321+00');
INSERT INTO public.users VALUES (5, 'Nguyễn Văn Huy', 'staff01@example.test', '0920000001', '$2b$10$Rdh043XJ4y.nbvzbKpEXfeld.qx0sOBVjx5F6CNz4.4UvKz6pvM/i', 'STAFF', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80', true, '2026-10-22 07:09:17.842586+00', '2026-10-26 06:37:55.020445+00');
INSERT INTO public.users VALUES (2, 'Admin', 'admin00@gmail.com', '0910000000', '$2b$10$J84349U6pdORMsSkGurvkupqdBKqSLbGNMI5b/eF6kzcdz.ua0yvi', 'ADMIN', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80', true, '2026-10-22 07:09:17.842586+00', '2026-10-22 07:09:17.842586+00');
INSERT INTO public.users VALUES (7, 'Đỗ Đức Mạnh', 'staff03@example.test', '0920000003', '$2b$10$pGTM21J1IFSFUuA0Q2K/mOMYKmwnGCFSSW54VrFxFjxEv3Im.V7QG', 'STAFF', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&q=80', true, '2026-10-22 07:09:17.842586+00', '2026-10-22 07:09:17.842586+00');
INSERT INTO public.users VALUES (3, 'Bùi Tiến Dũng', 'admin01@example.test', '0910000001', '$2b$10$J84349U6pdORMsSkGurvkupqdBKqSLbGNMI5b/eF6kzcdz.ua0yvi', 'ADMIN', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80', true, '2026-10-22 07:09:17.842586+00', '2026-10-22 07:09:17.842586+00');
INSERT INTO public.users VALUES (4, 'Đặng Thu Thảo', 'admin02@example.test', '0910000002', '$2b$10$J84349U6pdORMsSkGurvkupqdBKqSLbGNMI5b/eF6kzcdz.ua0yvi', 'ADMIN', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80', true, '2026-10-22 07:09:17.842586+00', '2026-10-22 07:09:17.842586+00');
INSERT INTO public.users VALUES (18, 'Đỗ Thùy Trang', 'admin.trang@vftfarms.vn', '0910000015', '$2b$10$J84349U6pdORMsSkGurvkupqdBKqSLbGNMI5b/eF6kzcdz.ua0yvi', 'ADMIN', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80', true, '2026-10-22 09:55:06.457439+00', '2026-10-22 09:55:06.457439+00');
INSERT INTO public.users VALUES (55, 'Nguyễn Việt Dũng', 'vietdungrv1107@gmail.com', '0363866296', '$2b$10$YSHxe1fcn6Ya4/nGPvPvue6LVjsOaKCB2WlTk7HEALdQodsMVtyn.', 'CUSTOMER', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&q=80', true, '2026-10-26 06:26:11.648873+00', '2026-10-26 06:26:11.648873+00');
INSERT INTO public.users VALUES (46, 'Nguyễn Thành Chung', 'khach.thanhchung@gmail.com', '0905888999', '$2b$10$pGTM21J1IFSFUuA0Q2K/mOMYKmwnGCFSSW54VrFxFjxEv3Im.V7QG', 'CUSTOMER', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&q=80', true, '2026-10-22 09:55:06.457439+00', '2026-10-22 09:55:06.457439+00');
INSERT INTO public.users VALUES (47, 'Bùi Hoàng Việt Anh', 'khach.vietanh@gmail.com', '0905999000', '$2b$10$pGTM21J1IFSFUuA0Q2K/mOMYKmwnGCFSSW54VrFxFjxEv3Im.V7QG', 'CUSTOMER', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&q=80', true, '2026-10-22 09:55:06.457439+00', '2026-10-22 09:55:06.457439+00');
INSERT INTO public.users VALUES (48, 'Nguyễn Thanh Bình', 'khach.thanhbinh@gmail.com', '0906000111', '$2b$10$pGTM21J1IFSFUuA0Q2K/mOMYKmwnGCFSSW54VrFxFjxEv3Im.V7QG', 'CUSTOMER', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80', true, '2026-10-22 09:55:06.457439+00', '2026-10-22 09:55:06.457439+00');
INSERT INTO public.users VALUES (49, 'Hồ Tấn Tài', 'khach.tantai@gmail.com', '0906111222', '$2b$10$pGTM21J1IFSFUuA0Q2K/mOMYKmwnGCFSSW54VrFxFjxEv3Im.V7QG', 'CUSTOMER', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80', true, '2026-10-22 09:55:06.457439+00', '2026-10-22 09:55:06.457439+00');
INSERT INTO public.users VALUES (51, 'Khuất Văn Khang', 'khach.vankhang@gmail.com', '0906333444', '$2b$10$pGTM21J1IFSFUuA0Q2K/mOMYKmwnGCFSSW54VrFxFjxEv3Im.V7QG', 'CUSTOMER', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80', true, '2026-10-22 09:55:06.457439+00', '2026-10-22 09:55:06.457439+00');
INSERT INTO public.users VALUES (52, 'Nguyễn Thái Sơn', 'khach.thaison@gmail.com', '0906444555', '$2b$10$pGTM21J1IFSFUuA0Q2K/mOMYKmwnGCFSSW54VrFxFjxEv3Im.V7QG', 'CUSTOMER', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80', true, '2026-10-22 09:55:06.457439+00', '2026-10-22 09:55:06.457439+00');
INSERT INTO public.users VALUES (15, 'Vũ Đình Trọng', 'staff.trong@vftfarms.vn', '0920000012', '$2b$10$pGTM21J1IFSFUuA0Q2K/mOMYKmwnGCFSSW54VrFxFjxEv3Im.V7QG', 'STAFF', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80', false, '2026-10-22 09:55:06.457439+00', '2026-10-22 09:55:06.457439+00');
INSERT INTO public.users VALUES (25, 'Dương Minh Châu', 'khach.chau@gmail.com', '0903777888', '$2b$10$pGTM21J1IFSFUuA0Q2K/mOMYKmwnGCFSSW54VrFxFjxEv3Im.V7QG', 'CUSTOMER', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80', false, '2026-10-22 09:55:06.457439+00', '2026-10-22 09:55:06.457439+00');
INSERT INTO public.users VALUES (35, 'Lương Xuân Trường', 'khach.truong@gmail.com', '0904777888', '$2b$10$pGTM21J1IFSFUuA0Q2K/mOMYKmwnGCFSSW54VrFxFjxEv3Im.V7QG', 'CUSTOMER', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&q=80', false, '2026-10-22 09:55:06.457439+00', '2026-10-22 09:55:06.457439+00');
INSERT INTO public.users VALUES (45, 'Phạm Tuấn Hải', 'khach.tuanhai@gmail.com', '0905777888', '$2b$10$pGTM21J1IFSFUuA0Q2K/mOMYKmwnGCFSSW54VrFxFjxEv3Im.V7QG', 'CUSTOMER', 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&q=80', false, '2026-10-22 09:55:06.457439+00', '2026-10-22 09:55:06.457439+00');
INSERT INTO public.users VALUES (50, 'Nhâm Mạnh Dũng', 'khach.manhdung@gmail.com', '0906222333', '$2b$10$pGTM21J1IFSFUuA0Q2K/mOMYKmwnGCFSSW54VrFxFjxEv3Im.V7QG', 'CUSTOMER', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80', false, '2026-10-22 09:55:06.457439+00', '2026-10-22 09:55:06.457439+00');
INSERT INTO public.users VALUES (1, 'Admin VFT Farms 01', 'Admin01@gmail.com', '0910000009', '$2b$10$J84349U6pdORMsSkGurvkupqdBKqSLbGNMI5b/eF6kzcdz.ua0yvi', 'ADMIN', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80', true, '2026-10-22 07:09:17.842586+00', '2026-10-22 08:19:29.388455+00');
INSERT INTO public.users VALUES (9, 'Trần Hoàng Nam', 'demo.user02@example.test', '0900000002', '$2b$10$pGTM21J1IFSFUuA0Q2K/mOMYKmwnGCFSSW54VrFxFjxEv3Im.V7QG', 'CUSTOMER', 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&q=80', true, '2026-10-22 07:09:17.842586+00', '2026-10-22 07:09:17.842586+00');
INSERT INTO public.users VALUES (10, 'Lê Thu Hà', 'demo.user03@example.test', '0900000003', '$2b$10$pGTM21J1IFSFUuA0Q2K/mOMYKmwnGCFSSW54VrFxFjxEv3Im.V7QG', 'CUSTOMER', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&q=80', true, '2026-10-22 07:09:17.842586+00', '2026-10-22 07:09:17.842586+00');
INSERT INTO public.users VALUES (11, 'Phạm Quốc Bảo', 'demo.user04@example.test', '0900000004', '$2b$10$pGTM21J1IFSFUuA0Q2K/mOMYKmwnGCFSSW54VrFxFjxEv3Im.V7QG', 'CUSTOMER', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&q=80', true, '2026-10-22 07:09:17.842586+00', '2026-10-22 07:09:17.842586+00');
INSERT INTO public.users VALUES (12, 'Võ Ngọc Lan', 'demo.user05@example.test', '0900000005', '$2b$10$pGTM21J1IFSFUuA0Q2K/mOMYKmwnGCFSSW54VrFxFjxEv3Im.V7QG', 'CUSTOMER', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80', true, '2026-10-22 07:09:17.842586+00', '2026-10-22 07:09:17.842586+00');
INSERT INTO public.users VALUES (27, 'Trịnh Kim Oanh', 'khach.oanh@gmail.com', '0903999000', '$2b$10$pGTM21J1IFSFUuA0Q2K/mOMYKmwnGCFSSW54VrFxFjxEv3Im.V7QG', 'CUSTOMER', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80', true, '2026-10-22 09:55:06.457439+00', '2026-10-22 09:55:06.457439+00');
INSERT INTO public.users VALUES (28, 'Lâm Khánh Chi', 'khach.chi@gmail.com', '0904000111', '$2b$10$pGTM21J1IFSFUuA0Q2K/mOMYKmwnGCFSSW54VrFxFjxEv3Im.V7QG', 'CUSTOMER', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80', true, '2026-10-22 09:55:06.457439+00', '2026-10-22 09:55:06.457439+00');
INSERT INTO public.users VALUES (29, 'Hồ Gia Bảo', 'khach.bao@gmail.com', '0904111222', '$2b$10$pGTM21J1IFSFUuA0Q2K/mOMYKmwnGCFSSW54VrFxFjxEv3Im.V7QG', 'CUSTOMER', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80', true, '2026-10-22 09:55:06.457439+00', '2026-10-22 09:55:06.457439+00');
INSERT INTO public.users VALUES (30, 'Tô Mỹ Uyên', 'khach.uyen@gmail.com', '0904222333', '$2b$10$pGTM21J1IFSFUuA0Q2K/mOMYKmwnGCFSSW54VrFxFjxEv3Im.V7QG', 'CUSTOMER', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80', true, '2026-10-22 09:55:06.457439+00', '2026-10-22 09:55:06.457439+00');
INSERT INTO public.users VALUES (31, 'Đoàn Văn Hậu', 'khach.hau@gmail.com', '0904333444', '$2b$10$pGTM21J1IFSFUuA0Q2K/mOMYKmwnGCFSSW54VrFxFjxEv3Im.V7QG', 'CUSTOMER', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&q=80', true, '2026-10-22 09:55:06.457439+00', '2026-10-22 09:55:06.457439+00');
INSERT INTO public.users VALUES (32, 'Nguyễn Quang Hải', 'khach.hai@gmail.com', '0904444555', '$2b$10$pGTM21J1IFSFUuA0Q2K/mOMYKmwnGCFSSW54VrFxFjxEv3Im.V7QG', 'CUSTOMER', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&q=80', true, '2026-10-22 09:55:06.457439+00', '2026-10-22 09:55:06.457439+00');
INSERT INTO public.users VALUES (33, 'Phan Văn Đức', 'khach.duc@gmail.com', '0904555666', '$2b$10$pGTM21J1IFSFUuA0Q2K/mOMYKmwnGCFSSW54VrFxFjxEv3Im.V7QG', 'CUSTOMER', 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&q=80', true, '2026-10-22 09:55:06.457439+00', '2026-10-22 09:55:06.457439+00');
INSERT INTO public.users VALUES (34, 'Quế Ngọc Hải', 'khach.ngochai@gmail.com', '0904666777', '$2b$10$pGTM21J1IFSFUuA0Q2K/mOMYKmwnGCFSSW54VrFxFjxEv3Im.V7QG', 'CUSTOMER', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&q=80', true, '2026-10-22 09:55:06.457439+00', '2026-10-22 09:55:06.457439+00');
INSERT INTO public.users VALUES (36, 'Nguyễn Công Phượng', 'khach.phuong@gmail.com', '0904888999', '$2b$10$pGTM21J1IFSFUuA0Q2K/mOMYKmwnGCFSSW54VrFxFjxEv3Im.V7QG', 'CUSTOMER', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80', true, '2026-10-22 09:55:06.457439+00', '2026-10-22 09:55:06.457439+00');
INSERT INTO public.users VALUES (37, 'Nguyễn Tuấn Anh', 'khach.tuananh@gmail.com', '0904999000', '$2b$10$pGTM21J1IFSFUuA0Q2K/mOMYKmwnGCFSSW54VrFxFjxEv3Im.V7QG', 'CUSTOMER', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80', true, '2026-10-22 09:55:06.457439+00', '2026-10-22 09:55:06.457439+00');
INSERT INTO public.users VALUES (38, 'Hà Đức Chinh', 'khach.chinh@gmail.com', '0905000111', '$2b$10$pGTM21J1IFSFUuA0Q2K/mOMYKmwnGCFSSW54VrFxFjxEv3Im.V7QG', 'CUSTOMER', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80', true, '2026-10-22 09:55:06.457439+00', '2026-10-22 09:55:06.457439+00');
INSERT INTO public.users VALUES (39, 'Nguyễn Tiến Linh', 'khach.linhtien@gmail.com', '0905111222', '$2b$10$pGTM21J1IFSFUuA0Q2K/mOMYKmwnGCFSSW54VrFxFjxEv3Im.V7QG', 'CUSTOMER', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80', true, '2026-10-22 09:55:06.457439+00', '2026-10-22 09:55:06.457439+00');
INSERT INTO public.users VALUES (40, 'Vũ Văn Thanh', 'khach.thanh@gmail.com', '0905222333', '$2b$10$pGTM21J1IFSFUuA0Q2K/mOMYKmwnGCFSSW54VrFxFjxEv3Im.V7QG', 'CUSTOMER', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80', true, '2026-10-22 09:55:06.457439+00', '2026-10-22 09:55:06.457439+00');
INSERT INTO public.users VALUES (41, 'Nguyễn Phong Hồng Duy', 'khach.duy@gmail.com', '0905333444', '$2b$10$pGTM21J1IFSFUuA0Q2K/mOMYKmwnGCFSSW54VrFxFjxEv3Im.V7QG', 'CUSTOMER', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80', true, '2026-10-22 09:55:06.457439+00', '2026-10-22 09:55:06.457439+00');
INSERT INTO public.users VALUES (42, 'Đỗ Duy Mạnh', 'khach.duymanh@gmail.com', '0905444555', '$2b$10$pGTM21J1IFSFUuA0Q2K/mOMYKmwnGCFSSW54VrFxFjxEv3Im.V7QG', 'CUSTOMER', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80', true, '2026-10-22 09:55:06.457439+00', '2026-10-22 09:55:06.457439+00');
INSERT INTO public.users VALUES (43, 'Trần Đình Trọng', 'khach.dinhtrong@gmail.com', '0905555666', '$2b$10$pGTM21J1IFSFUuA0Q2K/mOMYKmwnGCFSSW54VrFxFjxEv3Im.V7QG', 'CUSTOMER', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&q=80', true, '2026-10-22 09:55:06.457439+00', '2026-10-22 09:55:06.457439+00');
INSERT INTO public.users VALUES (44, 'Bùi Tấn Trường', 'khach.tantruong@gmail.com', '0905666777', '$2b$10$pGTM21J1IFSFUuA0Q2K/mOMYKmwnGCFSSW54VrFxFjxEv3Im.V7QG', 'CUSTOMER', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&q=80', true, '2026-10-22 09:55:06.457439+00', '2026-10-22 09:55:06.457439+00');
INSERT INTO public.users VALUES (14, 'Trần Bích Ngọc', 'staff.ngoc@vftfarms.vn', '0920000011', '$2b$10$9nZ4tk6mqXWG6I1SKgEYoOffbiOrhzcT5uwFmiNLNYmoyUO.W.Xai', 'STAFF', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80', true, '2026-10-22 09:55:06.457439+00', '2026-10-26 06:20:02.634258+00');
INSERT INTO public.users VALUES (13, 'Lê Hoàng Nam', 'staff.nam@vftfarms.vn', '0920000010', '$2b$10$pGTM21J1IFSFUuA0Q2K/mOMYKmwnGCFSSW54VrFxFjxEv3Im.V7QG', 'STAFF', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80', true, '2026-10-22 09:55:06.457439+00', '2026-10-22 09:55:06.457439+00');
INSERT INTO public.users VALUES (16, 'Nguyễn Hải Yến', 'staff.yen@vftfarms.vn', '0920000013', '$2b$10$pGTM21J1IFSFUuA0Q2K/mOMYKmwnGCFSSW54VrFxFjxEv3Im.V7QG', 'STAFF', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80', true, '2026-10-22 09:55:06.457439+00', '2026-10-22 09:55:06.457439+00');
INSERT INTO public.users VALUES (17, 'Phạm Quốc Bảo', 'staff.bao@vftfarms.vn', '0920000014', '$2b$10$pGTM21J1IFSFUuA0Q2K/mOMYKmwnGCFSSW54VrFxFjxEv3Im.V7QG', 'STAFF', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80', true, '2026-10-22 09:55:06.457439+00', '2026-10-22 09:55:06.457439+00');
INSERT INTO public.users VALUES (19, 'Ngô Thanh Vân', 'khach.van@gmail.com', '0903111222', '$2b$10$pGTM21J1IFSFUuA0Q2K/mOMYKmwnGCFSSW54VrFxFjxEv3Im.V7QG', 'CUSTOMER', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&q=80', true, '2026-10-22 09:55:06.457439+00', '2026-10-22 09:55:06.457439+00');
INSERT INTO public.users VALUES (20, 'Đặng Quốc Huy', 'khach.huy@gmail.com', '0903222333', '$2b$10$pGTM21J1IFSFUuA0Q2K/mOMYKmwnGCFSSW54VrFxFjxEv3Im.V7QG', 'CUSTOMER', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&q=80', true, '2026-10-22 09:55:06.457439+00', '2026-10-22 09:55:06.457439+00');
INSERT INTO public.users VALUES (21, 'Bùi Phương Linh', 'khach.linh@gmail.com', '0903333444', '$2b$10$pGTM21J1IFSFUuA0Q2K/mOMYKmwnGCFSSW54VrFxFjxEv3Im.V7QG', 'CUSTOMER', 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&q=80', true, '2026-10-22 09:55:06.457439+00', '2026-10-22 09:55:06.457439+00');
INSERT INTO public.users VALUES (22, 'Vương Kiến Quốc', 'khach.quoc@gmail.com', '0903444555', '$2b$10$pGTM21J1IFSFUuA0Q2K/mOMYKmwnGCFSSW54VrFxFjxEv3Im.V7QG', 'CUSTOMER', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&q=80', true, '2026-10-22 09:55:06.457439+00', '2026-10-22 09:55:06.457439+00');
INSERT INTO public.users VALUES (23, 'Lý Tiểu Long', 'khach.long@gmail.com', '0903555666', '$2b$10$pGTM21J1IFSFUuA0Q2K/mOMYKmwnGCFSSW54VrFxFjxEv3Im.V7QG', 'CUSTOMER', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&q=80', true, '2026-10-22 09:55:06.457439+00', '2026-10-22 09:55:06.457439+00');
INSERT INTO public.users VALUES (24, 'Hoàng Thị Hạnh', 'khach.hanh@gmail.com', '0903666777', '$2b$10$pGTM21J1IFSFUuA0Q2K/mOMYKmwnGCFSSW54VrFxFjxEv3Im.V7QG', 'CUSTOMER', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80', true, '2026-10-22 09:55:06.457439+00', '2026-10-22 09:55:06.457439+00');
INSERT INTO public.users VALUES (26, 'Mai Văn Hùng', 'khach.hung@gmail.com', '0903888999', '$2b$10$pGTM21J1IFSFUuA0Q2K/mOMYKmwnGCFSSW54VrFxFjxEv3Im.V7QG', 'CUSTOMER', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80', true, '2026-10-22 09:55:06.457439+00', '2026-10-22 09:55:06.457439+00');


--
-- Name: addresses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.addresses_id_seq', 1, false);


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categories_id_seq', 10, true);


--
-- Name: news_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.news_id_seq', 52, true);


--
-- Name: order_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.order_items_id_seq', 111, true);


--
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.orders_id_seq', 52, true);


--
-- Name: policies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.policies_id_seq', 6, true);


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_id_seq', 100, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 55, true);


--
-- Name: addresses addresses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.addresses
    ADD CONSTRAINT addresses_pkey PRIMARY KEY (id);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: categories categories_slug_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_slug_key UNIQUE (slug);


--
-- Name: news news_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.news
    ADD CONSTRAINT news_pkey PRIMARY KEY (id);


--
-- Name: news news_slug_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.news
    ADD CONSTRAINT news_slug_key UNIQUE (slug);


--
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);


--
-- Name: orders orders_order_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_order_code_key UNIQUE (order_code);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: policies policies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.policies
    ADD CONSTRAINT policies_pkey PRIMARY KEY (id);


--
-- Name: policies policies_slug_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.policies
    ADD CONSTRAINT policies_slug_key UNIQUE (slug);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: products products_slug_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_slug_key UNIQUE (slug);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_phone_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_phone_number_key UNIQUE (phone_number);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: idx_categories_parent; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_categories_parent ON public.categories USING btree (parent_id);


--
-- Name: idx_news_category; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_news_category ON public.news USING btree (category);


--
-- Name: idx_news_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_news_created_at ON public.news USING btree (created_at DESC);


--
-- Name: idx_news_published; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_news_published ON public.news USING btree (is_published);


--
-- Name: idx_news_slug; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_news_slug ON public.news USING btree (slug);


--
-- Name: idx_order_items_order; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_order_items_order ON public.order_items USING btree (order_id);


--
-- Name: idx_orders_code; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_orders_code ON public.orders USING btree (order_code);


--
-- Name: idx_orders_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_orders_user ON public.orders USING btree (user_id);


--
-- Name: idx_policies_slug; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_policies_slug ON public.policies USING btree (slug);


--
-- Name: idx_products_best_seller; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_products_best_seller ON public.products USING btree (is_best_seller);


--
-- Name: idx_products_category; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_products_category ON public.products USING btree (category_id);


--
-- Name: idx_products_slug; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_products_slug ON public.products USING btree (slug);


--
-- Name: addresses addresses_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.addresses
    ADD CONSTRAINT addresses_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: categories categories_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.categories(id) ON DELETE SET NULL;


--
-- Name: news news_author_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.news
    ADD CONSTRAINT news_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: order_items order_items_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: order_items order_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE SET NULL;


--
-- Name: orders orders_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: products products_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

