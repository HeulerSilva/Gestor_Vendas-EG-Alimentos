# 🧾 Gestor de Vendas — EG Alimentos

> Point-of-sale (POS) and cash management application for sales control at EG Alimentos, backed by a relational SQL Server database.

[![LinkedIn](https://img.shields.io/badge/LinkedIn-heulersilva-0077B5?style=flat&logo=linkedin&logoColor=white)](https://linkedin.com/in/heulersilva)
[![GitHub](https://img.shields.io/badge/GitHub-HeulerSilva-181717?style=flat&logo=github&logoColor=white)](https://github.com/HeulerSilva)

---

## 🧭 Overview

Full-stack POS (point-of-sale) application built for EG Alimentos, covering the operational sales cycle end-to-end: product catalog, customers, suppliers, purchase orders, sales, and daily cash register (caixa) control.

## 🛠️ Tech Stack

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)
![SQL Server](https://img.shields.io/badge/SQL%20Server-CC2927?style=flat&logo=microsoftsqlserver&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white)

## 🗄️ Data Model

Relational schema (SQL Server) covering the full operational cycle:

- **Vendedores** — sellers, with configurable commission rules
- **Clientes / Fornecedores** — customer and supplier registries (address, status)
- **Produtos** — product catalog with cost/margin/sale price, stock levels, and Brazilian tax fields (NCM, CFOP, CST, ICMS, IPI)
- **Pedidos / Pedido_Itens** — purchase orders and line items
- **Vendas / Venda_Itens** — sales and line items, with per-item discounts
- **Caixa** — daily cash register with expense tracking and closing control
- **Triggers** — automatic stock movement on order receipt and on sale (`TRG_MovimentaEstoque_Pedido`, `TRG_MovimentaEstoque_Venda`)

## 🔐 Security

Database credentials are managed via environment variables (see `.env.example`) — never hardcoded or committed to the repository.

## 👤 About

**Heuler Ferreira Silva** — Senior Data Engineer | Analytics Architect
15+ years in enterprise data ecosystems · SQL Expert · Modern Data Stack
📍 Brazil (Remote) · [linkedin.com/in/heulersilva](https://linkedin.com/in/heulersilva)
