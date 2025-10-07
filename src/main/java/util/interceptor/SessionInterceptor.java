package util.interceptor;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import model.Session;
import org.jspecify.annotations.Nullable;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;
import service.SessionService;

import java.time.LocalDateTime;

 @Component
public class SessionInterceptor implements HandlerInterceptor {

    private final SessionService sessionService;

    public SessionInterceptor(SessionService sessionService) {
        this.sessionService = sessionService;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String sessionId = null;
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals("sessionId")) {
                    sessionId = cookie.getValue();
                    break;
                }
            }
        }

        if(sessionId == null){
            response.sendRedirect(request.getContextPath() + "/login");
            return false;
        }

        Session session = sessionService.getSession(sessionId);
        if(session.getExpiresAt().isBefore(LocalDateTime.now())){
            sessionService.invalidate(sessionId);
            response.sendRedirect(request.getContextPath() + "/login");
            return false;
        }

        request.setAttribute("user", session.getUser());
        return true;
    }


}
