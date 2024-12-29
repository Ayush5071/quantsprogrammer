import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import Roadmap from "@/models/roadmapModel";  // Assuming you have this model in the "models" folder
import { NextResponse, NextRequest } from "next/server";

connect();

export async function GET(request: NextRequest) {
  try {
    // Fetch all users from the User model
    const users = await User.find().select("-password");  // Don't return password for security

    // Define the total number of tasks for each course
    const totalFrontendTasks = 18;
    const totalFullStackTasks = 40;
    const totalBackendTasks = 26;
    const totalDataAnalysisTasks = 16;

    // Map each user and fetch their course progress from the Roadmap model
    const usersWithProgress = await Promise.all(
      users.map(async (user) => {
        // Fetch the roadmap for each user based on their userId
        const roadmap = await Roadmap.findOne({ userId: user._id.toString() });

        if (!roadmap) {
          return { ...user.toObject(), courseProgress: {} };
        }

        // Calculate progress for each course based on the checkedData
        const frontendProgress = roadmap.checkedData.filter(
          (task: string | string[]) => task.includes("FrontendWeb")
        ).length;
        const fullStackProgress = roadmap.checkedData.filter(
          (task: string | string[]) => task.includes("FullStackWeb")
        ).length;
        const backendProgress = roadmap.checkedData.filter(
          (task: string | string[]) => task.includes("BackendWeb")
        ).length;
        const dataAnalysisProgress = roadmap.checkedData.filter(
          (task: string | string[]) => task.includes("DataAnalysis")
        ).length;

        const courseProgress = {
          FrontEndWeb: {
            totalTasks: totalFrontendTasks,
            completedTasks: frontendProgress,
            progressPercentage: (frontendProgress / totalFrontendTasks) * 100,
          },
          FullStackWeb: {
            totalTasks: totalFullStackTasks,
            completedTasks: fullStackProgress,
            progressPercentage: (fullStackProgress / totalFullStackTasks) * 100,
          },
          BackendWeb: {
            totalTasks: totalBackendTasks,
            completedTasks: backendProgress,
            progressPercentage: (backendProgress / totalBackendTasks) * 100,
          },
          DataAnalysis: {
            totalTasks: totalDataAnalysisTasks,
            completedTasks: dataAnalysisProgress,
            progressPercentage: (dataAnalysisProgress / totalDataAnalysisTasks) * 100,
          },
        };

        return { ...user.toObject(), courseProgress };
      })
    );

    // Return the combined and ordered response with users and their course progress
    return NextResponse.json({ success: true, data: usersWithProgress });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
