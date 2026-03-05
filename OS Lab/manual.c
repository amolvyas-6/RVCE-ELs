#include <stdio.h>

void show_manual() {
    printf("\n============= SHELL MANUAL =============\n");
    printf("\nAvailable Commands:\n\n");
    
    printf("1. cd <directory>\n");
    printf("   Changes the current working directory\n");
    printf("   Example: cd Documents\n");
    printf("   Example: cd ..\n\n");
    
    printf("2. pwd\n");
    printf("   Prints the current working directory path\n");
    printf("   Example: pwd\n\n");
    
    printf("3. ls\n");
    printf("   Lists files and directories in the current directory with detailed information\n");
    printf("   Shows: permissions, links, owner, group, size, modification time, name\n");
    printf("   Example: ls\n\n");
    
    printf("4. cp <source> <destination>\n");
    printf("   Copies a file from source to destination\n");
    printf("   Example: cp file1.txt file2.txt\n\n");
    
    printf("5. mv <source> <destination>\n");
    printf("   Moves or renames a file from source to destination\n");
    printf("   Example: mv oldfile.txt newfile.txt\n\n");
    
    printf("6. rm <file>\n");
    printf("   Removes/deletes the specified file\n");
    printf("   Example: rm unwanted.txt\n\n");
    
    printf("7. Command Piping\n");
    printf("   Supports piping commands using | operator\n");
    printf("   Example: ls | grep .txt\n\n");
    
    printf("8. Background Processes\n");
    printf("   Run commands in background using &\n");
    printf("   Example: sleep 10 &\n\n");
    
    printf("9. sudo apt install <package>\n");
    printf("   Installs system packages using apt package manager\n");
    printf("   Example: sudo apt install gcc\n\n");
    
    printf("10. exit\n");
    printf("    Exits the shell\n");
    printf("    Example: exit\n\n");
    
    printf("Note: All commands support standard Unix/Linux syntax\n");
    printf("=======================================\n\n");
}
