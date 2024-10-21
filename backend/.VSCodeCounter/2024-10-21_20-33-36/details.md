# Details

Date : 2024-10-21 20:33:36

Directory c:\\Users\\bmarc\\OneDrive\\Documents\\GitHub\\projetCertifV2\\backend

Total : 64 files,  9919 codes, 481 comments, 836 blanks, all 11236 lines

[Summary](results.md) / Details / [Diff Summary](diff.md) / [Diff Details](diff-details.md)

## Files
| filename | language | code | comment | blank | total |
| :--- | :--- | ---: | ---: | ---: | ---: |
| [compose.override.yaml](/compose.override.yaml) | YAML | 13 | 4 | 3 | 20 |
| [compose.yaml](/compose.yaml) | YAML | 17 | 7 | 3 | 27 |
| [composer.json](/composer.json) | JSON | 91 | 0 | 1 | 92 |
| [composer.lock](/composer.lock) | JSON | 7,123 | 0 | 1 | 7,124 |
| [config/bundles.php](/config/bundles.php) | PHP | 12 | 0 | 2 | 14 |
| [config/packages/api_platform.yaml](/config/packages/api_platform.yaml) | YAML | 21 | 0 | 2 | 23 |
| [config/packages/cache.yaml](/config/packages/cache.yaml) | YAML | 2 | 13 | 5 | 20 |
| [config/packages/doctrine.yaml](/config/packages/doctrine.yaml) | YAML | 43 | 4 | 6 | 53 |
| [config/packages/doctrine_migrations.yaml](/config/packages/doctrine_migrations.yaml) | YAML | 4 | 2 | 1 | 7 |
| [config/packages/framework.yaml](/config/packages/framework.yaml) | YAML | 8 | 5 | 4 | 17 |
| [config/packages/lexik_jwt_authentication.yaml](/config/packages/lexik_jwt_authentication.yaml) | YAML | 9 | 0 | 1 | 10 |
| [config/packages/mailer.yaml](/config/packages/mailer.yaml) | YAML | 3 | 0 | 1 | 4 |
| [config/packages/nelmio_cors.yaml](/config/packages/nelmio_cors.yaml) | YAML | 16 | 0 | 3 | 19 |
| [config/packages/routing.yaml](/config/packages/routing.yaml) | YAML | 6 | 3 | 2 | 11 |
| [config/packages/security.yaml](/config/packages/security.yaml) | YAML | 34 | 21 | 15 | 70 |
| [config/packages/twig.yaml](/config/packages/twig.yaml) | YAML | 5 | 0 | 2 | 7 |
| [config/packages/validator.yaml](/config/packages/validator.yaml) | YAML | 6 | 4 | 2 | 12 |
| [config/preload.php](/config/preload.php) | PHP | 4 | 0 | 2 | 6 |
| [config/routes.yaml](/config/routes.yaml) | YAML | 7 | 0 | 0 | 7 |
| [config/routes/api_platform.yaml](/config/routes/api_platform.yaml) | YAML | 4 | 0 | 1 | 5 |
| [config/routes/framework.yaml](/config/routes/framework.yaml) | YAML | 4 | 0 | 1 | 5 |
| [config/routes/security.yaml](/config/routes/security.yaml) | YAML | 3 | 0 | 1 | 4 |
| [config/services.yaml](/config/services.yaml) | YAML | 12 | 9 | 6 | 27 |
| [public/index.php](/public/index.php) | PHP | 6 | 0 | 4 | 10 |
| [src/Command/AddCryptoProductsCommand.php](/src/Command/AddCryptoProductsCommand.php) | PHP | 56 | 1 | 16 | 73 |
| [src/Command/CreateUserCommand.php](/src/Command/CreateUserCommand.php) | PHP | 42 | 1 | 13 | 56 |
| [src/Command/ImportStripeProductsCommand.php](/src/Command/ImportStripeProductsCommand.php) | PHP | 75 | 14 | 9 | 98 |
| [src/Command/UpdateCategorieDataCommand.php](/src/Command/UpdateCategorieDataCommand.php) | PHP | 64 | 1 | 17 | 82 |
| [src/Command/UpdateCryptoDataCommand.php](/src/Command/UpdateCryptoDataCommand.php) | PHP | 68 | 2 | 16 | 86 |
| [src/Command/UpdateDeviseDataCommand.php](/src/Command/UpdateDeviseDataCommand.php) | PHP | 49 | 1 | 16 | 66 |
| [src/Command/UpdatePriceDataCommand.php](/src/Command/UpdatePriceDataCommand.php) | PHP | 63 | 1 | 19 | 83 |
| [src/Controller/EmailController.php](/src/Controller/EmailController.php) | PHP | 66 | 1 | 26 | 93 |
| [src/Controller/OrderController.php](/src/Controller/OrderController.php) | PHP | 25 | 0 | 9 | 34 |
| [src/Controller/PaymentController.php](/src/Controller/PaymentController.php) | PHP | 154 | 0 | 20 | 174 |
| [src/Controller/SecurityController.php](/src/Controller/SecurityController.php) | PHP | 19 | 7 | 10 | 36 |
| [src/Controller/UserController.php](/src/Controller/UserController.php) | PHP | 137 | 12 | 40 | 189 |
| [src/Controller/WalletController.php](/src/Controller/WalletController.php) | PHP | 49 | 0 | 15 | 64 |
| [src/Entity/Categorie.php](/src/Entity/Categorie.php) | PHP | 96 | 0 | 40 | 136 |
| [src/Entity/Crypto.php](/src/Entity/Crypto.php) | PHP | 319 | 9 | 118 | 446 |
| [src/Entity/Devise.php](/src/Entity/Devise.php) | PHP | 69 | 7 | 20 | 96 |
| [src/Entity/Order.php](/src/Entity/Order.php) | PHP | 131 | 1 | 51 | 183 |
| [src/Entity/PriceData.php](/src/Entity/PriceData.php) | PHP | 63 | 0 | 21 | 84 |
| [src/Entity/ProduitStripe.php](/src/Entity/ProduitStripe.php) | PHP | 51 | 0 | 17 | 68 |
| [src/Entity/Stripe.php](/src/Entity/Stripe.php) | PHP | 62 | 0 | 25 | 87 |
| [src/Entity/User.php](/src/Entity/User.php) | PHP | 258 | 43 | 80 | 381 |
| [src/Entity/Wallet.php](/src/Entity/Wallet.php) | PHP | 83 | 7 | 25 | 115 |
| [src/Kernel.php](/src/Kernel.php) | PHP | 8 | 0 | 4 | 12 |
| [src/Repository/CategorieRepository.php](/src/Repository/CategorieRepository.php) | PHP | 12 | 31 | 6 | 49 |
| [src/Repository/CryptoRepository.php](/src/Repository/CryptoRepository.php) | PHP | 12 | 31 | 6 | 49 |
| [src/Repository/DeviseRepository.php](/src/Repository/DeviseRepository.php) | PHP | 12 | 31 | 6 | 49 |
| [src/Repository/OrderRepository.php](/src/Repository/OrderRepository.php) | PHP | 21 | 31 | 7 | 59 |
| [src/Repository/PriceDataRepository.php](/src/Repository/PriceDataRepository.php) | PHP | 12 | 31 | 6 | 49 |
| [src/Repository/ProduitStripeRepository.php](/src/Repository/ProduitStripeRepository.php) | PHP | 12 | 31 | 6 | 49 |
| [src/Repository/StripeRepository.php](/src/Repository/StripeRepository.php) | PHP | 12 | 31 | 6 | 49 |
| [src/Repository/UserRepository.php](/src/Repository/UserRepository.php) | PHP | 24 | 34 | 8 | 66 |
| [src/Repository/WalletRepository.php](/src/Repository/WalletRepository.php) | PHP | 12 | 31 | 6 | 49 |
| [src/Security/APIAuthenticator.php](/src/Security/APIAuthenticator.php) | PHP | 35 | 5 | 10 | 50 |
| [src/Security/AppAuthenticator.php](/src/Security/AppAuthenticator.php) | PHP | 47 | 2 | 12 | 61 |
| [src/Service/CryptoService.php](/src/Service/CryptoService.php) | PHP | 57 | 8 | 16 | 81 |
| [src/Service/OrderService.php](/src/Service/OrderService.php) | PHP | 90 | 3 | 18 | 111 |
| [src/Service/WalletService.php](/src/Service/WalletService.php) | PHP | 40 | 1 | 12 | 53 |
| [templates/base.html.twig](/templates/base.html.twig) | HTML (Twig) | 15 | 0 | 2 | 17 |
| [templates/security/login.html.twig](/templates/security/login.html.twig) | HTML (Twig) | 30 | 0 | 8 | 38 |
| [templates/user/index.html.twig](/templates/user/index.html.twig) | HTML (Twig) | 16 | 0 | 5 | 21 |

[Summary](results.md) / Details / [Diff Summary](diff.md) / [Diff Details](diff-details.md)