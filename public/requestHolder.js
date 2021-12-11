app.get("/task", async (req, res) => {   
    try {
        const results = await db.execute("SELECT * FROM tasks");
        return render_template(requestHolder.html)
        } catch (err) {
        return next(err);
                        }
    });