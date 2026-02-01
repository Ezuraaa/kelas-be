import { desc, eq, getTableColumns, ilike, or, sql } from "drizzle-orm";
import express from "express";
import { departemen, subjects } from "../db/schema/index.js";
import { db } from "../db/index.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const { search, departement, page = 1, limit = 10 } = req.query;

        const currentPage = Math.max(1, parseInt(String(page), 10) || 1);
        const limitPage = Math.min(Math.max(1, parseInt(String(limit), 10) || 10), 100);

        const offset = (currentPage - 1) * limitPage;

        const filterConditions = [];
        if(search) {
            filterConditions.push(
                or(
                    ilike(subjects.name, `%${search}%`),
                    ilike(subjects.code, `%${search}%`)
                )
            )
        }

        if(departement) {
            const deptPattern = `%${String(departement).replace(/[%_]/g, '\\$&')}%`;
            filterConditions.push(ilike(departemen.name, deptPattern));
        }

        const whereClause = filterConditions.length > 0 ? or(...filterConditions) : undefined;

        const countResault =  await db
        .select({ count: sql<number>`count(*)`})
        .from(subjects)
        .leftJoin(departemen, eq(subjects.departemenId, departemen.id))
        .where(whereClause)

        const totalCount = countResault[0]?.count ?? 0;

        const subjectsList = await db.select({ ...getTableColumns(subjects), 
            departement: { ...getTableColumns(departemen)}
        }).from(subjects).leftJoin(departemen, eq(subjects.departemenId, departemen.id))
        .where(whereClause)
        .orderBy(desc(subjects.createdAt))
        .limit(limitPage)
        .offset(offset);

        res.status(200).json({
            data: subjectsList,
            pagination: {
                page: currentPage,
                limit: limitPage,
                total: totalCount,
                totalPages: Math.ceil(totalCount / limitPage)
            }
        })

    } catch (e) {
        console.error(`GET /subjects error: ${e}`);
        res.status(500).json({ error: "Failed to get subjects"});
    }
})

export default router;