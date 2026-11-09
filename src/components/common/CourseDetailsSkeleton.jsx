export const CourseDetailsSkeleton = () => {
    return (
        <div className="min-h-screen bg-[#F5F8FD] animate-pulse" aria-busy="true" aria-label="Loading course details">
            {/* Hero Banner Skeleton */}
            <section className="bg-[#131E4A] py-14 sm:py-20 px-4 sm:px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-4">
                        <div className="h-6 w-36 bg-white/20 rounded-full" />
                        <div className="h-10 w-4/5 bg-white/20 rounded-lg" />
                        <div className="h-4 w-full bg-white/10 rounded" />
                        <div className="h-4 w-3/4 bg-white/10 rounded" />
                        <div className="flex gap-4 pt-4">
                            <div className="h-8 w-28 bg-white/20 rounded" />
                            <div className="h-8 w-28 bg-white/20 rounded" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content & Sidebar Skeleton */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Syllabus Modules */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                            <div className="h-7 w-48 bg-slate-200 rounded" />
                            <div className="space-y-3">
                                <div className="h-14 bg-slate-100 rounded-xl" />
                                <div className="h-14 bg-slate-100 rounded-xl" />
                                <div className="h-14 bg-slate-100 rounded-xl" />
                            </div>
                        </div>
                    </div>

                    {/* Right: Checkout Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                            <div className="h-48 bg-slate-200 rounded-xl" />
                            <div className="h-8 w-32 bg-slate-200 rounded" />
                            <div className="h-12 w-full bg-slate-300 rounded-xl" />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CourseDetailsSkeleton;
