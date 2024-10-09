mod constants;
mod matrix;
mod numbers;
mod values;

use tauri::{Manager, WebviewWindowBuilder};

#[tauri::command]
async fn open_project_overview(app_handle: tauri::AppHandle) {
    let _new_window = WebviewWindowBuilder::new(
        &app_handle,
        "project_overview",
        tauri::WebviewUrl::App("windows/project_overview.html".into()),
    )
    .title("Project Overview")
    .build()
    .unwrap();
}

#[tauri::command]
async fn close_window(app_handle: tauri::AppHandle, window_label: String) {
    let target_window = app_handle.get_webview_window(&window_label);

    if let Some(window) = target_window {
        window.close().unwrap()
    }
}

#[tauri::command]
async fn hide_window(app_handle: tauri::AppHandle, window_label: String) {
    let target_window = app_handle.get_webview_window(&window_label);

    if let Some(window) = target_window {
        window.hide().unwrap()
    }
}

#[tauri::command]
async fn show_window(app_handle: tauri::AppHandle, window_label: String) {
    let target_window = app_handle.get_webview_window(&window_label);

    if let Some(window) = target_window {
        window.show().unwrap()
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            numbers::evaluate_expression,
            close_window,
            hide_window,
            show_window,
            open_project_overview,
            constants::open_constants_window,
            constants::open_new_constant_window,
            constants::emit_const_picked_event,
            constants::emit_const_created_event,
            numbers::add,
            numbers::subtract,
            numbers::multiply,
            numbers::divide,
            numbers::abs,
            numbers::power,
            matrix::make_identity_mtx,
            numbers::to_rad,
            numbers::to_deg,
            numbers::sin,
            numbers::cos,
            numbers::tg,
            numbers::ctg,
            matrix::scalar_multiplication,
            matrix::add_vecs_matrices,
            numbers::floor,
            numbers::ceil,
            matrix::sum_all,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
