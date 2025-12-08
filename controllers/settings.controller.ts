import { NextResponse } from "next/server";
import { SettingsService } from "@/services/settings.service";
import { updateEmployeeSchema, updateFeatureSchema } from "@/helpers/validateSettings";
import { captureAction } from "@/helpers/captureAction";
import { ACTION_TYPES } from "@/constants/actionTypes";
import { getSession } from "@/lib/session";

export class SettingsController {
    static async listEmployees() {
        try {
            const employees = await SettingsService.getEmployees();
            return NextResponse.json(employees);
        } catch (error) {
            return NextResponse.json({ error: "Failed to fetch employees" }, { status: 500 });
        }
    }

    static async getEmployee(req: Request, { params }: { params: { id: string } }) {
        try {
            const employee = await SettingsService.getEmployeeById(params.id);
            if (!employee) return NextResponse.json({ error: "Employee not found" }, { status: 404 });
            return NextResponse.json(employee);
        } catch (error) {
            return NextResponse.json({ error: "Failed to fetch employee" }, { status: 500 });
        }
    }

    static async updateEmployee(req: Request, { params }: { params: { id: string } }) {
        try {
            const body = await req.json();
            const validated = updateEmployeeSchema.parse(body);

            const employee = await SettingsService.updateEmployee(params.id, validated);

            const session = await getSession();
            await captureAction(
                session?.id,
                ACTION_TYPES.EMPLOYEE_ROLE_UPDATE, // Or generic settings update
                "USER",
                employee.id,
                { changes: validated }
            );

            return NextResponse.json(employee);
        } catch (error: any) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
    }

    static async listFeatures() {
        try {
            const features = await SettingsService.getFeatures();
            return NextResponse.json(features);
        } catch (error) {
            return NextResponse.json({ error: "Failed to fetch features" }, { status: 500 });
        }
    }

    static async updateFeature(req: Request) {
        try {
            const body = await req.json();
            const { key, isEnabled } = body;

            if (!key) return NextResponse.json({ error: "Key is required" }, { status: 400 });

            const feature = await SettingsService.updateFeature(key, isEnabled);

            const session = await getSession();
            await captureAction(
                session?.id,
                ACTION_TYPES.SETTINGS_UPDATE,
                "FEATURE_TOGGLE",
                feature.id,
                { key, isEnabled }
            );

            return NextResponse.json(feature);
        } catch (error: any) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
    }
}
