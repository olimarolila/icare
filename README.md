<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

<p align="center">
<a href="https://github.com/laravel/framework/actions"><img src="https://github.com/laravel/framework/workflows/tests/badge.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

## About Laravel

Laravel is a web application framework with expressive, elegant syntax. We believe development must be an enjoyable and creative experience to be truly fulfilling. Laravel takes the pain out of development by easing common tasks used in many web projects, such as:

- [Simple, fast routing engine](https://laravel.com/docs/routing).
- [Powerful dependency injection container](https://laravel.com/docs/container).
- Multiple back-ends for [session](https://laravel.com/docs/session) and [cache](https://laravel.com/docs/cache) storage.
- Expressive, intuitive [database ORM](https://laravel.com/docs/eloquent).
- Database agnostic [schema migrations](https://laravel.com/docs/migrations).
- [Robust background job processing](https://laravel.com/docs/queues).
- [Real-time event broadcasting](https://laravel.com/docs/broadcasting).

Laravel is accessible, powerful, and provides tools required for large, robust applications.

## Learning Laravel

Laravel has the most extensive and thorough [documentation](https://laravel.com/docs) and video tutorial library of all modern web application frameworks, making it a breeze to get started with the framework.

You may also try the [Laravel Bootcamp](https://bootcamp.laravel.com), where you will be guided through building a modern Laravel application from scratch.

If you don't feel like reading, [Laracasts](https://laracasts.com) can help. Laracasts contains thousands of video tutorials on a range of topics including Laravel, modern PHP, unit testing, and JavaScript. Boost your skills by digging into our comprehensive video library.

## Laravel Sponsors

We would like to extend our thanks to the following sponsors for funding Laravel development. If you are interested in becoming a sponsor, please visit the [Laravel Partners program](https://partners.laravel.com).

### Premium Partners

- **[Vehikl](https://vehikl.com)**
- **[Tighten Co.](https://tighten.co)**
- **[Kirschbaum Development Group](https://kirschbaumdevelopment.com)**
- **[64 Robots](https://64robots.com)**
- **[Curotec](https://www.curotec.com/services/technologies/laravel)**
- **[DevSquad](https://devsquad.com/hire-laravel-developers)**
- **[Redberry](https://redberry.international/laravel-development)**
- **[Active Logic](https://activelogic.com)**

## Contributing

Thank you for considering contributing to the Laravel framework! The contribution guide can be found in the [Laravel documentation](https://laravel.com/docs/contributions).

## Code of Conduct

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

## Test Coverage Overview

This project includes an extensive automated test suite to verify core behavior across controllers and models.

### How to Run Tests

- Run the full test suite:
	- `php artisan test`

### Feature Tests (HTTP / Controllers)

- `tests/Feature/Auth/*`
	- Authentication, registration, password reset, password update, email verification, and password confirmation flows.

- `tests/Feature/DashboardControllerTest.php`
	- `DashboardController@citizen`: citizen dashboard requires `citizen` role and returns the `Citizen/Dashboard` Inertia component.
	- `DashboardController@admin`: admin dashboard requires `admin` role and returns the `Admin/Dashboard` Inertia component.

- `tests/Feature/AdminDashboardRangeTest.php`
	- `DashboardController@admin` with `range=week`: returns metrics for the past week; test asserts that expected keys (like `totalReports`, `resolvedReports`, etc.) exist without relying on exact counts.

- `tests/Feature/WelcomeControllerTest.php`
	- `WelcomeController@welcome`: public home page (`/`) returns the `Welcome` Inertia component with top reports and status counts.

- `tests/Feature/ReportStoreTest.php`
	- `ReportController@store`: a citizen can submit a report; request validation, ticket ID generation, initial `Pending` status, and `user_id` linkage are verified.

- `tests/Feature/ReportStoreValidationTest.php`
	- `ReportController@store` validation: missing required fields, invalid latitude/longitude ranges, and invalid image types are rejected with validation errors.

- `tests/Feature/ReportImageUploadTest.php`
	- `ReportController@store` images: valid images are accepted and saved; the test asserts that the resulting `images` field contains non-empty paths.

- `tests/Feature/ReportStatusUpdateTest.php`
	- `ReportController@update`: an admin can change a report status through the controller (e.g., `Pending → In Progress → Resolved`).

- `tests/Feature/ReportsFilterTest.php`
	- `ReportController@publicIndex`: public `/reports` listing supports filters for sort, recent days, category, status, and per-page, plus reset behavior. Also verifies sorting by votes.

- `tests/Feature/AdminReportsIndexTest.php`
	- `ReportController@index` (admin): admin reports table supports filters by status, category, search, and sort order; only matching reports appear in the results.

- `tests/Feature/ReportVoteActionTest.php`
	- `ReportController@vote` (JSON + redirect):
		- First-time upvote/downvote adjusts `votes` and creates a `ReportVote`.
		- Repeating the same vote toggles back to neutral.
		- Switching from up to down (and vice versa) updates both `votes` and the stored vote value.
		- Non-JSON requests receive a redirect response.

- `tests/Feature/ReportVoteFeedTest.php`
	- `ReportController@upvoted`: citizen upvoted feed returns only reports the user has upvoted in `Citizen/UpvotedReports`.
	- `ReportController@downvoted`: citizen downvoted feed returns only reports the user has downvoted in `Citizen/DownvotedReports`.

- `tests/Feature/ReportCommentTest.php`
	- `ReportController@comment`: authenticated users can add comments to reports; `body` validation is enforced and JSON requests return `{ ok: true }`.

- `tests/Feature/ReportArchiveTest.php`
	- `ReportController@archive` / `restore`: admins can archive and restore reports; `archived_at` / `archived_by` are set and cleared with the expected redirects.

- `tests/Feature/ReportExportTest.php`
	- `ReportController@export`: admins can export filtered reports as CSV (`text/csv; charset=UTF-8`) and only the filtered records appear in the CSV body.

- `tests/Feature/AdminUsersControllerTest.php`
	- `UserController@index`: admin users list supports search, role filter, sorting, and per-page settings, and renders the `Admin/Users` Inertia component with matching `filters`.
	- `UserController@all`: returns a JSON list of users for client-side consumption.
	- `UserController@update`: admins can update user name, email, role, and role description.
	- `UserController@archive` / `destroy`: soft-delete/archive users by setting `archived_at` / `archived_by` (HTML and JSON flows).
	- `UserController@restore`: restores archived users and redirects back to the archives view (`tab=users`).

- `tests/Feature/AdminAccessAndUserIndexTest.php`
	- Ensures archived users are excluded from the main admin users index and verifies that non-admin users cannot access admin-only routes (like the admin dashboard).

- `tests/Feature/ArchiveControllerTest.php`
	- `ArchiveController@index`: unified archives page loads with archived users and reports and renders the `Admin/Archives` Inertia component.

- `tests/Feature/ArchiveFiltersTest.php`
	- `ArchiveController@index` filters: archives table can be filtered by type (users/reports), search query, and status so that only matching archived records are listed.

- `tests/Feature/ArchiveRestoreActionsTest.php`
	- `ArchiveController` + restore routes: from the archives UI, admins can restore archived users and reports and are redirected to the correct tab.

- `tests/Feature/ProfileTest.php`
	- `ProfileController`: profile screen rendering, profile updates, email verification status behavior, and account deletion are fully tested.

- `tests/Feature/VoteAndCommentAuthorizationTest.php`
	- Ensures guests (unauthenticated users) are redirected to login when attempting to vote or comment on reports.

- `tests/Feature/ExampleTest.php`
	- Basic application smoke test ensuring `/login` returns a successful response.

### Unit Tests (Models)

- `tests/Unit/UserModelTest.php`
	- `User` relationships: verifies `archivedByUser` correctly resolves the user who archived another user.

- `tests/Unit/ReportModelTest.php`
	- `Report` relationships: checks `user`, `comments`, and `votes` associations.

- `tests/Unit/CommentModelTest.php`
	- `Comment` relationships: ensures each comment belongs to the correct `User` and `Report`.

- `tests/Unit/ReportVoteModelTest.php`
	- `ReportVote` relationships: ensures each vote belongs to the correct `User` and `Report`.

- `tests/Unit/ExampleTest.php`
	- Basic truthiness/unit smoke test.

This structure is intended to make it easy to add new tests alongside the existing ones by controller or model. When you add new features, prefer creating a matching `Feature` test near the existing file rather than starting from scratch.
