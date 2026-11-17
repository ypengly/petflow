use tauri::{AppHandle, Manager, PhysicalPosition, PhysicalSize, WebviewUrl, WebviewWindow, WebviewWindowBuilder, WindowEvent};

const SMALL: (f64, f64) = (240.0, 260.0);
const BIG: (f64, f64) = (560.0, 560.0);

fn overlay(app: &AppHandle) -> Result<WebviewWindow, String> {
    app.get_webview_window("overlay").ok_or_else(|| "overlay is not running".to_string())
}
fn err<E: std::fmt::Display>(e: E) -> String { e.to_string() }

/// Creates the transparent, undecorated, always-on-top pet window.
#[tauri::command]
fn start_overlay(app: AppHandle, x: Option<i32>, y: Option<i32>, always_on_top: bool, click_through: bool) -> Result<(), String> {
    if app.get_webview_window("overlay").is_some() { return Ok(()); }
    let w = WebviewWindowBuilder::new(&app, "overlay", WebviewUrl::App("index.html?overlay=1".into()))
        .title("PetFlow Pet").inner_size(SMALL.0, SMALL.1)
        .transparent(true).decorations(false).shadow(false).resizable(false)
        .skip_taskbar(true).always_on_top(always_on_top).build().map_err(err)?;
    match (x, y) {
        (Some(x), Some(y)) => w.set_position(PhysicalPosition::new(x, y)).map_err(err)?,
        _ => if let Ok(Some(m)) = app.primary_monitor() {
            let (mp, ms) = (m.position(), m.size());
            w.set_position(PhysicalPosition::new(mp.x + ms.width as i32 - 320, mp.y + ms.height as i32 - 360)).map_err(err)?;
        },
    }
    w.set_ignore_cursor_events(click_through).map_err(err)
}

#[tauri::command]
fn stop_overlay(app: AppHandle) -> Result<(), String> { overlay(&app)?.close().map_err(err) }

/// Grows the window while a menu/panel is open, keeping the pet anchored at bottom-centre.
#[tauri::command]
fn resize_overlay(app: AppHandle, expanded: bool) -> Result<(), String> {
    let w = overlay(&app)?; let sf = w.scale_factor().map_err(err)?;
    let (pos, size) = (w.outer_position().map_err(err)?, w.outer_size().map_err(err)?);
    let (nw, nh) = if expanded { BIG } else { SMALL };
    let (nw, nh) = ((nw * sf) as i32, (nh * sf) as i32);
    if nw == size.width as i32 && nh == size.height as i32 { return Ok(()); }
    w.set_size(PhysicalSize::new(nw as u32, nh as u32)).map_err(err)?;
    w.set_position(PhysicalPosition::new(pos.x + (size.width as i32 - nw) / 2, pos.y + size.height as i32 - nh)).map_err(err)
}

/// Moves the pet window, clamped to the monitor it is on (works across monitors by dragging).
#[tauri::command]
fn move_overlay(app: AppHandle, dx: f64, dy: f64) -> Result<(), String> {
    let w = overlay(&app)?; let sf = w.scale_factor().map_err(err)?;
    let (pos, size) = (w.outer_position().map_err(err)?, w.outer_size().map_err(err)?);
    let (mut nx, mut ny) = (pos.x + (dx * sf) as i32, pos.y + (dy * sf) as i32);
    if let Ok(Some(m)) = w.current_monitor() {
        let (mp, ms) = (m.position(), m.size());
        nx = nx.clamp(mp.x, (mp.x + ms.width as i32 - size.width as i32).max(mp.x));
        ny = ny.clamp(mp.y, (mp.y + ms.height as i32 - size.height as i32).max(mp.y));
    }
    w.set_position(PhysicalPosition::new(nx, ny)).map_err(err)
}

#[tauri::command]
fn drag_overlay(app: AppHandle) -> Result<(), String> { overlay(&app)?.start_dragging().map_err(err) }

#[tauri::command]
fn set_always_on_top(app: AppHandle, on: bool) -> Result<(), String> { overlay(&app)?.set_always_on_top(on).map_err(err) }

#[tauri::command]
fn set_click_through(app: AppHandle, on: bool) -> Result<(), String> { overlay(&app)?.set_ignore_cursor_events(on).map_err(err) }

#[tauri::command]
fn show_main(app: AppHandle) -> Result<(), String> {
    let m = app.get_webview_window("main").ok_or("no main window")?;
    m.unminimize().map_err(err)?; m.show().map_err(err)?; m.set_focus().map_err(err)
}

pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_autostart::init(tauri_plugin_autostart::MacosLauncher::LaunchAgent, None))
        .on_window_event(|window, event| {
            // Closing the main window while the pet is running minimizes it instead, so the pet stays.
            if let WindowEvent::CloseRequested { api, .. } = event {
                if window.label() == "main" && window.app_handle().get_webview_window("overlay").is_some() {
                    api.prevent_close(); let _ = window.minimize();
                }
            }
        })
        .invoke_handler(tauri::generate_handler![start_overlay, stop_overlay, resize_overlay, move_overlay, drag_overlay, set_always_on_top, set_click_through, show_main])
        .run(tauri::generate_context!())
        .expect("error while running PetFlow");
}
