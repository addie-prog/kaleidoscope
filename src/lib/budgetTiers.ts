const getBudgetTier = async () => {
    try {
        const res = await fetch("/api/budget-tier");
        const data = await res.json();
        localStorage.setItem("Tiers", JSON.stringify(data?.map((t: any) => t)));
        return data;
    } catch (e) {
        console.log("Error in fetching budget tiers: ", e);
        return [];
    }
}

export default getBudgetTier