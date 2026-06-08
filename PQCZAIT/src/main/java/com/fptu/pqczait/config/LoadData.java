package com.fptu.pqczait.config;

import com.fptu.pqczait.service.ProjectService;
import com.fptu.pqczait.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class LoadData  implements ApplicationRunner {
    private final ProjectService projectService;
    private final UserService userService;      // thêm dòng này
    @Override
    public void run(ApplicationArguments args) throws Exception {
        projectService.insertData();
        userService.insertDefaultUser();        // thêm dòng này
    }
}
