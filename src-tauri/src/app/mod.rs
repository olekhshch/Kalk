use serde_json::Value;
use tauri::{AppHandle, Emitter, Manager};

#[tauri::command]
pub async fn emit_event(
    app_handle: AppHandle,
    event_name: Option<Value>,
    target_window_name: Option<Value>,
) {
    match (event_name, target_window_name) {
        (Some(Value::String(event)), Some(Value::String(window_label))) => {
            if let Some(target_window) = app_handle.get_webview_window(&window_label) {
                target_window.emit(event.as_str(), "").unwrap();
            }
        }
        _ => {}
    }
}
