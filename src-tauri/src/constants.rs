// handlers for creation of a constants flow on the canvas

use tauri::{Emitter, Manager, WebviewWindowBuilder};

// opens dialog with the table of available constants
#[tauri::command]
pub async fn open_constants_window(app_handle: tauri::AppHandle) {
    let _new_window = WebviewWindowBuilder::new(
        &app_handle,
        "constants",
        tauri::WebviewUrl::App("windows/constants.html".into()),
    )
    .title("Constants")
    .inner_size(520., 220.)
    .resizable(false)
    .build()
    .unwrap();
}

// opens Constant Creator dialog
#[tauri::command]
pub async fn open_new_constant_window(app_handle: tauri::AppHandle) {
    let _new_window = WebviewWindowBuilder::new(
        &app_handle,
        "new-constant",
        tauri::WebviewUrl::App("windows/new_constant.html".into()),
    )
    .title("New constant")
    .inner_size(520., 228.)
    .resizable(false)
    .build()
    .unwrap();
}

// informs main window that a contant was picked to be placed on the canvas
#[tauri::command]
pub fn emit_const_picked_event(app_handle: tauri::AppHandle, const_id: String) {
    let editor_window = app_handle.get_webview_window("calc");
    match editor_window {
        Some(window) => window.emit("const-picked", "RUST event").unwrap(),
        None => {}
    }
    app_handle.emit("const-picked", const_id).unwrap();
}

// informs other windows that a new constant was created in Constant Creator window, and it can be picked from LocalStorage
#[tauri::command]
pub fn emit_const_created_event(app_handle: tauri::AppHandle) {
    let constants_window = app_handle.get_webview_window("constants");
    let editor_window = app_handle.get_webview_window("calc");
    match editor_window {
        Some(window) => window.emit("const-created", "").unwrap(),
        None => {}
    }
    match constants_window {
        Some(window) => window.emit("const-created", "").unwrap(),
        None => {}
    }
    app_handle.emit("const-created", "").unwrap();
}
