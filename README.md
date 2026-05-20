# Pickleball Booking System

Dự án xây dựng hệ thống quản lý và đặt sân Pickleball phiên bản đơn giản, phục vụ báo cáo cuối kì.

Project gồm 2 phần chính:

- `frontend`: giao diện người dùng bằng Angular
- `backend`: REST API bằng Spring Boot, kết nối SQL Server

---

## 1. Công nghệ sử dụng

### Frontend

- Angular
- TypeScript
- SCSS
- Angular Router

### Backend

- Java 21
- Spring Boot
- Spring Web
- Spring Data JPA
- Hibernate
- Lombok
- Maven

### Database

- SQL Server Express
- SQL Server Management Studio
- Database name: `pickleball_booking`

---

## 2. Cấu trúc thư mục dự án

```txt
pickleball-booking/
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/
│   │   │   │   ├── models/
│   │   │   │   └── services/
│   │   │   │
│   │   │   ├── features/
│   │   │   │   ├── admin/
│   │   │   │   │   ├── booking-management/
│   │   │   │   │   ├── court-management/
│   │   │   │   │   └── dashboard/
│   │   │   │   │
│   │   │   │   ├── auth/
│   │   │   │   │   ├── login/
│   │   │   │   │   └── register/
│   │   │   │   │
│   │   │   │   ├── booking/
│   │   │   │   │   ├── booking-form/
│   │   │   │   │   └── my-bookings/
│   │   │   │   │
│   │   │   │   ├── courts/
│   │   │   │   │   ├── court-detail/
│   │   │   │   │   └── court-list/
│   │   │   │   │
│   │   │   │   └── home/
│   │   │   │
│   │   │   ├── layouts/
│   │   │   │   └── main-layout/
│   │   │   │
│   │   │   ├── app.routes.ts
│   │   │   └── app.config.ts
│   │   │
│   │   └── styles.scss
│   │
│   ├── package.json
│   ├── angular.json
│   └── README.md
│
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/pickleball/backend/
│   │   │   │   ├── config/
│   │   │   │   ├── controller/
│   │   │   │   ├── dto/
│   │   │   │   ├── entity/
│   │   │   │   ├── enums/
│   │   │   │   ├── repository/
│   │   │   │   ├── service/
│   │   │   │   └── BackendApplication.java
│   │   │   │
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   │
│   │   └── test/
│   │
│   ├── pom.xml
│   └── README.md
│
└── README.md
3. Chức năng chính
User
Xem trang chủ
Xem danh sách sân Pickleball
Xem chi tiết sân
Đặt sân theo ngày và giờ
Xem lịch đặt sân của tôi
Hủy lịch đặt
Đăng nhập / đăng ký
Admin
Xem dashboard thống kê
Quản lý danh sách sân
Thêm, sửa, xóa sân
Quản lý lịch đặt sân
Xác nhận hoặc hủy lịch đặt sân
Quản lý người dùng cơ bản
4. Yêu cầu môi trường

Trước khi chạy project, cần cài:

Node.js
Angular CLI
Java JDK 21
Maven
SQL Server / SQL Server Express
SQL Server Management Studio
VS Code
Git

Kiểm tra phiên bản:

node -v
npm -v
ng version
java -version
mvn -v
git --version
5. Cách chạy Frontend

Mở terminal tại thư mục gốc project:

cd frontend

Cài đặt package:

npm install

Chạy Angular:

ng serve

Frontend chạy tại:

http://localhost:4200
6. Cách chạy Backend

Mở terminal tại thư mục gốc project:

cd backend

Chạy Spring Boot:

mvn spring-boot:run

Backend chạy tại:

http://localhost:8080

Build backend:

mvn clean install

Dừng backend đang chạy:

Ctrl + C

Nếu terminal hỏi:

Terminate batch job (Y/N)?

thì nhập:

Y
7. Cấu hình SQL Server
7.1. Tạo database

Mở SQL Server Management Studio, đăng nhập vào SQL Server, sau đó chạy:

CREATE DATABASE pickleball_booking;
GO

Chỉ cần tạo database, không cần tạo bảng thủ công.

Spring Boot JPA/Hibernate sẽ tự tạo bảng dựa theo các class @Entity.

Ví dụ:

User.java    -> users
Court.java   -> courts
Booking.java -> bookings
7.2. Cấu hình tài khoản sa

Nếu chưa bật tài khoản sa, chạy:

ALTER LOGIN sa ENABLE;
ALTER LOGIN sa WITH PASSWORD = 'Admin12345';
GO

Sau đó đăng nhập lại bằng:

Server name: localhost\SQLEXPRESS
Authentication: SQL Server Authentication
Login: sa
Password: Admin12345
7.3. File application.properties

Đường dẫn:

backend/src/main/resources/application.properties

Nội dung cấu hình:

spring.application.name=backend

server.port=8080

spring.datasource.url=jdbc:sqlserver://localhost:1433;databaseName=pickleball_booking;encrypt=true;trustServerCertificate=true
spring.datasource.username=sa
spring.datasource.password=Admin12345
spring.datasource.driver-class-name=com.microsoft.sqlserver.jdbc.SQLServerDriver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

Nếu máy dùng SQL Express nhưng chưa cấu hình port 1433, có thể dùng tạm cấu hình sau:

spring.datasource.url=jdbc:sqlserver://localhost;instanceName=SQLEXPRESS;databaseName=pickleball_booking;encrypt=true;trustServerCertificate=true

Tuy nhiên, nên bật TCP/IP và set port 1433 để cấu hình ổn định hơn.

8. Cách fix lỗi SQL Server TCP/IP

Trong quá trình chạy backend, nếu gặp lỗi:

The server SQLEXPRESS is not configured to listen with TCP/IP.

hoặc:

The TCP/IP connection to the host localhost, port 1433 has failed.

thì làm theo các bước sau.

Bước 1: Mở SQL Server Configuration Manager

Bấm:

Windows + R

Thử nhập một trong các lệnh sau:

SQLServerManager16.msc
SQLServerManager15.msc
SQLServerManager14.msc

Tùy phiên bản SQL Server đang cài.

Bước 2: Bật TCP/IP

Vào:

SQL Server Network Configuration
→ Protocols for SQLEXPRESS

Tìm:

TCP/IP

Chuột phải vào TCP/IP và chọn:

Enable
Bước 3: Set port 1433

Nhấp đôi vào TCP/IP.

Chọn tab:

IP Addresses

Kéo xuống cuối phần:

IPAll

Sửa như sau:

TCP Dynamic Ports: để trống
TCP Port: 1433

Bấm OK.

Bước 4: Restart SQL Server

Trong SQL Server Configuration Manager, vào:

SQL Server Services

Tìm:

SQL Server (SQLEXPRESS)

Chuột phải chọn:

Restart

Nếu có:

SQL Server Browser

thì cũng chuột phải chọn:

Start

hoặc:

Restart
Bước 5: Kiểm tra port 1433

Mở PowerShell, chạy:

netstat -ano | findstr :1433

Nếu thấy dòng dạng:

TCP    0.0.0.0:1433    0.0.0.0:0    LISTENING

nghĩa là SQL Server đã lắng nghe port 1433.

Bước 6: Chạy lại backend
cd backend
mvn spring-boot:run

Nếu thành công sẽ thấy:

Tomcat started on port 8080
Started BackendApplication
9. Một số lỗi thường gặp
Lỗi 1: The server SQLEXPRESS is not configured to listen with TCP/IP

Nguyên nhân:

SQLEXPRESS chưa bật TCP/IP.

Cách sửa:

Bật TCP/IP trong SQL Server Configuration Manager.
Set TCP Port = 1433.
Restart SQL Server (SQLEXPRESS).
Lỗi 2: Connection refused: getsockopt

Nguyên nhân:

SQL Server chưa chạy hoặc chưa mở port 1433.

Cách sửa:

Kiểm tra SQL Server (SQLEXPRESS) đang Running.
Kiểm tra TCP/IP đã Enable.
Kiểm tra port 1433 bằng netstat.
Lỗi 3: Login failed for user 'sa'

Nguyên nhân:

Sai mật khẩu sa hoặc SQL Server chưa bật SQL Server Authentication.

Cách sửa:

Trong SSMS, chạy:

ALTER LOGIN sa ENABLE;
ALTER LOGIN sa WITH PASSWORD = 'Admin12345';
GO

Sau đó vào:

Server Properties
→ Security
→ SQL Server and Windows Authentication mode

Restart SQL Server.

Lỗi 4: Cannot open database "pickleball_booking"

Nguyên nhân:

Database chưa được tạo.

Cách sửa:

CREATE DATABASE pickleball_booking;
GO
Lỗi 5: Port 8080 was already in use

Nguyên nhân:

Backend cũ vẫn đang chạy ở port 8080.

Cách sửa:

Trong terminal đang chạy backend:

Ctrl + C

Nếu vẫn bị chiếm port, mở PowerShell:

netstat -ano | findstr :8080

Lấy PID ở cuối dòng, rồi kill:

taskkill /PID <PID> /F

Ví dụ:

taskkill /PID 12345 /F
10. API dự kiến
Court API
GET    /api/courts
GET    /api/courts/{id}
POST   /api/courts
PUT    /api/courts/{id}
DELETE /api/courts/{id}
Booking API
GET    /api/bookings
GET    /api/bookings/my-bookings
POST   /api/bookings
PUT    /api/bookings/{id}/confirm
PUT    /api/bookings/{id}/cancel
DELETE /api/bookings/{id}
Auth API
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
Dashboard API
GET /api/admin/dashboard
11. Luồng chạy project

Nên mở 2 terminal riêng.

Terminal 1: chạy backend
cd backend
mvn spring-boot:run
Terminal 2: chạy frontend
cd frontend
ng serve

Sau đó mở:

Frontend: http://localhost:4200
Backend:  http://localhost:8080
12. Quy ước Git cho team

Clone project:

git clone <link-repo>
cd pickleball-booking

Tạo nhánh mới:

git checkout -b feat/ten-chuc-nang

Ví dụ:

git checkout -b feat/court-list

Commit code:

git add .
git commit -m "feat: add court list page"

Push nhánh:

git push -u origin feat/court-list