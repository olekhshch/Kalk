mod numbers;
mod values;
mod vectors;

use tauri::{Emitter, Manager, WebviewWindowBuilder};

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
async fn open_constants_window(app_handle: tauri::AppHandle) {
    let _new_window = WebviewWindowBuilder::new(
        &app_handle,
        "constants",
        tauri::WebviewUrl::App("windows/constants.html".into()),
    )
    .title("Constants")
    .build()
    .unwrap();
}

#[tauri::command]
async fn open_new_constant_window(app_handle: tauri::AppHandle) {
    let _new_window = WebviewWindowBuilder::new(
        &app_handle,
        "new-constant",
        tauri::WebviewUrl::App("windows/new_constant.html".into()),
    )
    .title("New constant")
    .resizable(false)
    .build()
    .unwrap();
}

#[tauri::command]
fn emit_const_picked_event(app_handle: tauri::AppHandle, const_id: String) {
    let editor_window = app_handle.get_webview_window("calc");
    match editor_window {
        Some(window) => window.emit("const-picked", "RUST event").unwrap(),
        None => {}
    }
    app_handle.emit("const-picked", const_id).unwrap();
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            numbers::evaluate_expression,
            open_project_overview,
            open_constants_window,
            open_new_constant_window,
            emit_const_picked_event,
            numbers::add,
            numbers::subtract,
            numbers::multiply,
            numbers::divide,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
