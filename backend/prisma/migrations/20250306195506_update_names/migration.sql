/*
  Warnings:

  - The primary key for the `Category` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `category_id` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Category` table. All the data in the column will be lost.
  - The primary key for the `Chat` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `buyer_id` on the `Chat` table. All the data in the column will be lost.
  - You are about to drop the column `chat_id` on the `Chat` table. All the data in the column will be lost.
  - You are about to drop the column `chat_platform` on the `Chat` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Chat` table. All the data in the column will be lost.
  - You are about to drop the column `order_id` on the `Chat` table. All the data in the column will be lost.
  - You are about to drop the column `seller_id` on the `Chat` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Chat` table. All the data in the column will be lost.
  - The primary key for the `Message` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `chat_id` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `message_id` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `sender_id` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `sent_at` on the `Message` table. All the data in the column will be lost.
  - The primary key for the `Order` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `created_at` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `escrow_status` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `order_id` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `order_status` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `payment_method` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `seller_id` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `total_price` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `Order` table. All the data in the column will be lost.
  - The primary key for the `OrderItem` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `order_id` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `order_item_id` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `product_id` on the `OrderItem` table. All the data in the column will be lost.
  - The primary key for the `Product` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `category_id` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `product_id` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `seller_id` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `stock_quantity` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Product` table. All the data in the column will be lost.
  - The primary key for the `Rating` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `created_at` on the `Rating` table. All the data in the column will be lost.
  - You are about to drop the column `rating_id` on the `Rating` table. All the data in the column will be lost.
  - You are about to drop the column `seller_id` on the `Rating` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `Rating` table. All the data in the column will be lost.
  - The primary key for the `Seller` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `catalogue_name` on the `Seller` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Seller` table. All the data in the column will be lost.
  - You are about to drop the column `payment_method` on the `Seller` table. All the data in the column will be lost.
  - You are about to drop the column `seller_id` on the `Seller` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Seller` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `Seller` table. All the data in the column will be lost.
  - The primary key for the `Transaction` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `created_at` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `order_id` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `transaction_id` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `transaction_type` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `wallet_id` on the `Transaction` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `created_at` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `first_name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `last_name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `User` table. All the data in the column will be lost.
  - The primary key for the `Wallet` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `created_at` on the `Wallet` table. All the data in the column will be lost.
  - You are about to drop the column `seller_id` on the `Wallet` table. All the data in the column will be lost.
  - You are about to drop the column `total_earned` on the `Wallet` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Wallet` table. All the data in the column will be lost.
  - You are about to drop the column `wallet_id` on the `Wallet` table. All the data in the column will be lost.
  - The primary key for the `Wishlist` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `created_at` on the `Wishlist` table. All the data in the column will be lost.
  - You are about to drop the column `product_id` on the `Wishlist` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `Wishlist` table. All the data in the column will be lost.
  - You are about to drop the column `wishlist_id` on the `Wishlist` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Seller` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[sellerId]` on the table `Wallet` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `Category` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `updatedAt` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `buyerId` to the `Chat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `chatPlatform` to the `Chat` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `Chat` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `sellerId` to the `Chat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Chat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `chatId` to the `Message` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `Message` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `senderId` to the `Message` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `Order` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `orderStatus` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentMethod` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sellerId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalPrice` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `OrderItem` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `orderId` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productId` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categoryId` to the `Product` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `Product` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `sellerId` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stockQuantity` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Product` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `Rating` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `sellerId` to the `Rating` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Rating` table without a default value. This is not possible if the table is not empty.
  - Added the required column `catalogueName` to the `Seller` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `Seller` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `paymentMethod` to the `Seller` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Seller` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Seller` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `Transaction` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `orderId` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transactionType` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `walletId` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `User` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `User` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `lastName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `Wallet` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `sellerId` to the `Wallet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Wallet` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `Wishlist` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `productId` to the `Wishlist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Wishlist` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_buyer_id_fkey";

-- DropForeignKey
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_order_id_fkey";

-- DropForeignKey
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_seller_id_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_chat_id_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_sender_id_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_seller_id_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_user_id_fkey";

-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_order_id_fkey";

-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_product_id_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_category_id_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_seller_id_fkey";

-- DropForeignKey
ALTER TABLE "Rating" DROP CONSTRAINT "Rating_seller_id_fkey";

-- DropForeignKey
ALTER TABLE "Rating" DROP CONSTRAINT "Rating_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Seller" DROP CONSTRAINT "Seller_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_order_id_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_wallet_id_fkey";

-- DropForeignKey
ALTER TABLE "Wallet" DROP CONSTRAINT "Wallet_seller_id_fkey";

-- DropForeignKey
ALTER TABLE "Wishlist" DROP CONSTRAINT "Wishlist_product_id_fkey";

-- DropForeignKey
ALTER TABLE "Wishlist" DROP CONSTRAINT "Wishlist_user_id_fkey";

-- DropIndex
DROP INDEX "Seller_user_id_key";

-- DropIndex
DROP INDEX "Wallet_seller_id_key";

-- AlterTable
ALTER TABLE "Category" DROP CONSTRAINT "Category_pkey",
DROP COLUMN "category_id",
DROP COLUMN "created_at",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD CONSTRAINT "Category_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_pkey",
DROP COLUMN "buyer_id",
DROP COLUMN "chat_id",
DROP COLUMN "chat_platform",
DROP COLUMN "created_at",
DROP COLUMN "order_id",
DROP COLUMN "seller_id",
DROP COLUMN "updated_at",
ADD COLUMN     "buyerId" TEXT NOT NULL,
ADD COLUMN     "chatPlatform" "ChatPlatform" NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "orderId" TEXT,
ADD COLUMN     "sellerId" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD CONSTRAINT "Chat_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Message" DROP CONSTRAINT "Message_pkey",
DROP COLUMN "chat_id",
DROP COLUMN "message_id",
DROP COLUMN "sender_id",
DROP COLUMN "sent_at",
ADD COLUMN     "chatId" TEXT NOT NULL,
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "senderId" TEXT NOT NULL,
ADD COLUMN     "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD CONSTRAINT "Message_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Order" DROP CONSTRAINT "Order_pkey",
DROP COLUMN "created_at",
DROP COLUMN "escrow_status",
DROP COLUMN "order_id",
DROP COLUMN "order_status",
DROP COLUMN "payment_method",
DROP COLUMN "seller_id",
DROP COLUMN "total_price",
DROP COLUMN "updated_at",
DROP COLUMN "user_id",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "escrowStatus" "EscrowStatus" NOT NULL DEFAULT 'HELD',
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "orderStatus" "OrderStatus" NOT NULL,
ADD COLUMN     "paymentMethod" "PaymentMethod" NOT NULL,
ADD COLUMN     "sellerId" TEXT NOT NULL,
ADD COLUMN     "totalPrice" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL,
ADD CONSTRAINT "Order_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_pkey",
DROP COLUMN "order_id",
DROP COLUMN "order_item_id",
DROP COLUMN "product_id",
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "orderId" TEXT NOT NULL,
ADD COLUMN     "productId" TEXT NOT NULL,
ADD CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Product" DROP CONSTRAINT "Product_pkey",
DROP COLUMN "category_id",
DROP COLUMN "created_at",
DROP COLUMN "product_id",
DROP COLUMN "seller_id",
DROP COLUMN "stock_quantity",
DROP COLUMN "updated_at",
ADD COLUMN     "categoryId" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "sellerId" TEXT NOT NULL,
ADD COLUMN     "stockQuantity" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD CONSTRAINT "Product_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Rating" DROP CONSTRAINT "Rating_pkey",
DROP COLUMN "created_at",
DROP COLUMN "rating_id",
DROP COLUMN "seller_id",
DROP COLUMN "user_id",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "sellerId" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL,
ADD CONSTRAINT "Rating_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Seller" DROP CONSTRAINT "Seller_pkey",
DROP COLUMN "catalogue_name",
DROP COLUMN "created_at",
DROP COLUMN "payment_method",
DROP COLUMN "seller_id",
DROP COLUMN "updated_at",
DROP COLUMN "user_id",
ADD COLUMN     "catalogueName" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "paymentMethod" "PaymentMethod" NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL,
ADD CONSTRAINT "Seller_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_pkey",
DROP COLUMN "created_at",
DROP COLUMN "order_id",
DROP COLUMN "transaction_id",
DROP COLUMN "transaction_type",
DROP COLUMN "updated_at",
DROP COLUMN "wallet_id",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "orderId" TEXT NOT NULL,
ADD COLUMN     "transactionType" "TransactionType" NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "walletId" TEXT NOT NULL,
ADD CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "created_at",
DROP COLUMN "first_name",
DROP COLUMN "last_name",
DROP COLUMN "updated_at",
DROP COLUMN "user_id",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Wallet" DROP CONSTRAINT "Wallet_pkey",
DROP COLUMN "created_at",
DROP COLUMN "seller_id",
DROP COLUMN "total_earned",
DROP COLUMN "updated_at",
DROP COLUMN "wallet_id",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "sellerId" TEXT NOT NULL,
ADD COLUMN     "totalEarned" DECIMAL(65,30) NOT NULL DEFAULT 0.00,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD CONSTRAINT "Wallet_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Wishlist" DROP CONSTRAINT "Wishlist_pkey",
DROP COLUMN "created_at",
DROP COLUMN "product_id",
DROP COLUMN "user_id",
DROP COLUMN "wishlist_id",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "productId" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL,
ADD CONSTRAINT "Wishlist_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "Seller_userId_key" ON "Seller"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_sellerId_key" ON "Wallet"("sellerId");

-- AddForeignKey
ALTER TABLE "Seller" ADD CONSTRAINT "Seller_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wallet" ADD CONSTRAINT "Wallet_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "Seller"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "Seller"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "Seller"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wishlist" ADD CONSTRAINT "Wishlist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wishlist" ADD CONSTRAINT "Wishlist_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "Seller"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "Seller"("id") ON DELETE CASCADE ON UPDATE CASCADE;
