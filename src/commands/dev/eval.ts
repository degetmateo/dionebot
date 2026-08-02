import { ActionRowBuilder, ActionRowData, APIInteractionResponse, APIInteractionResponseCallbackData, APIModalInteractionResponseCallbackComponent, APIModalInteractionResponseCallbackData, AttachmentBuilder, ButtonBuilder, ButtonStyle, ChannelSelectMenuBuilder, ColorResolvable, ComponentType, ContainerBuilder, FileBuilder, JSONEncodable, MediaGalleryBuilder, MediaGalleryItemBuilder, MessageActionRowComponentBuilder, MessageActionRowComponentData, MessageFlags, ModalBuilder, ModalComponentData, ModalData, PermissionFlagsBits, RESTPostAPIInteractionCallbackWithResponseResult, Routes, SectionBuilder, SeparatorBuilder, SeparatorSpacingSize, SlashCommandBuilder, TextDisplayBuilder, ThumbnailBuilder } from "discord.js";
import GuildChatInputCommandInteraction from "../../extensions/guildChatInputCommandInteraction.extension";
import GenericError from "../../errors/genericError";
import Helpers from "../../helpers";
import SettingsModule from "../../modules/settings.module";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('eval')
        .setDescription('eval')
        .setNSFW(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(option => 
            option
                .setName('value')
                .setDescription('value')
                .setRequired(true)
        ),
    execute: async (interaction: GuildChatInputCommandInteraction) => {
        if (interaction.user.id != process.env.DEV_ID) {
            throw new GenericError('Unauthorized.');
        };

        const value = interaction.options.getString('value', true);
        const args = value.split(' ');
        const prefix = args[0];

    //     const botAvatarURL = interaction.client.user.avatarURL({ extension: "png", size: 512 }) as string;

    //     const textDisplay = new TextDisplayBuilder()
    //         .setContent('🔹 This is a TextDisplay component.');

    //     const separator = new SeparatorBuilder()
    //         .setDivider(true)
    //         .setSpacing(SeparatorSpacingSize.Small);

    //     const thumbnail = new ThumbnailBuilder({ media: { url: botAvatarURL } });
        
    //     const SectionThumbnail = new SectionBuilder()
    //         .addTextDisplayComponents(
    //             new TextDisplayBuilder().setContent('📄 **Section Title**'),
    //             new TextDisplayBuilder().setContent('This is a description inside a Section component, with a thumbnail.')
    //         )
    //         .setThumbnailAccessory(thumbnail);

    //         const channelSelectMenu = new ChannelSelectMenuBuilder()
    //             .setCustomId('channel_select_menu')
    //             .setPlaceholder('Select a channel…');

    //         // const selectActionRow = new ActionRowBuilder().addComponents(channelSelectMenu).data.type = ComponentType.ActionRow;
        
    //         const row: ActionRowData<MessageActionRowComponentBuilder | MessageActionRowComponentData> = {
    //             components: [channelSelectMenu],
    //             type: ComponentType.ActionRow
    //         };

    //         const mediaGallery = new MediaGalleryBuilder().addItems(
    //             new MediaGalleryItemBuilder().setURL('https://raw.githubusercontent.com/ZarScape/ZarScape/refs/heads/main/images/ZarScape/logo-with-background.png'),
    //             new MediaGalleryItemBuilder().setURL('https://raw.githubusercontent.com/ZarScape/ZarScape/refs/heads/main/images/ZarScape/logo-with-background.png')
    //         );

    //     const sectionWithButtons = [
    //         new SectionBuilder()
    //             .addTextDisplayComponents(new TextDisplayBuilder().setContent('🌐 GitHub'))
    //             .setButtonAccessory(
    //             new ButtonBuilder()
    //                 .setLabel('GitHub')
    //                 .setURL('https://github.com/ZarScape')
    //                 .setStyle(ButtonStyle.Link)
    //             ),
    //         new SectionBuilder()
    //             .addTextDisplayComponents(new TextDisplayBuilder().setContent('📺 **YouTube**'))
    //             .setButtonAccessory(
    //             new ButtonBuilder()
    //                 .setLabel('Channel')
    //                 .setURL('https://www.youtube.com/@ZarScape')
    //                 .setStyle(ButtonStyle.Link)
    //             ),
    //         new SectionBuilder()
    //             .addTextDisplayComponents(new TextDisplayBuilder().setContent('💬 **Discord**'))
    //             .setButtonAccessory(
    //             new ButtonBuilder()
    //                 .setLabel('Zar HQ')
    //                 .setURL('https://discord.gg/6YVmxA4Qsf')
    //                 .setStyle(ButtonStyle.Link)
    //             )
    //         ];

    //     const dummyJSON = Buffer.from(JSON.stringify({ message: 'This is a dummy JSON file', timestamp: Date.now() }, null, 2));
    //     const attachment = new AttachmentBuilder(dummyJSON, { name: 'dummy.json' });
    //     const fileComponent = new FileBuilder().setURL('attachment://dummy.json');

    // const container = new ContainerBuilder()
    //   .setAccentColor([171, 230, 9])
    //   .addMediaGalleryComponents(mediaGallery)
    //   .addSectionComponents(SectionThumbnail)
    //   .addMediaGalleryComponents(
    //     new MediaGalleryBuilder().addItems(new MediaGalleryItemBuilder().setURL(botAvatarURL))
    //   )
    //   .addSectionComponents(...sectionWithButtons)
    //   .addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(SeparatorSpacingSize.Small))
    //   .addTextDisplayComponents(
    //     new TextDisplayBuilder().setContent('📝 **This message is fully composed of Components V2.**'),
    //     new TextDisplayBuilder().setContent('- Use TextDisplay for static text.'),
    //     new TextDisplayBuilder().setContent('- Use Section for grouping text with accessories.'),
    //     new TextDisplayBuilder().setContent('- Use MediaGallery for images/carousels.'),
    //     new TextDisplayBuilder().setContent('- Use Separator for dividing blocks of content.'),
    //     new TextDisplayBuilder().setContent('- Use File to attach JSON, images, or other files.'),
    //     new TextDisplayBuilder().setContent('- Use Button as interactive links or actions.'),
    //     new TextDisplayBuilder().setContent('- Use ChannelSelectMenu to let users pick a channel.')
    //   )
    //   .addFileComponents(fileComponent);

        const button = new ButtonBuilder()
            .setLabel('Support')                                 // Button text
            .setURL('https://discord.gg/6YVmxA4Qsf') // URL to open
            .setStyle(ButtonStyle.Link);                              // Must be Link style as link button type is used

        // SectionBuilder combines text and a button accessory
        const section = new SectionBuilder()
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent('🔗 Click the button to join support')
            )
            .setButtonAccessory(button); // Attach the link button to the section

        // ContainerBuilder holds the section (and optionally multiple sections)
        const container = new ContainerBuilder()
            .setAccentColor(0x5865F2)       // Optional accent color
            .addSectionComponents(section); // Add the section to the container

        // return interaction.reply({
        //     flags: MessageFlags.IsComponentsV2,
        //     components: [container],
        //     // files: [attachment]
        // });

        if (prefix === 'ccc') {
            const cooldown = args[1];

            if (!cooldown) throw new GenericError('Cooldown is required.');
            if (!Helpers.isNumber(cooldown)) throw new GenericError('Cooldown must be a number.');

            interaction.client.settings.character_claim_cooldown = Number(cooldown);
            await SettingsModule.save(interaction.client.settings);

            interaction.reply({
                content: "Done.",
                flags: "Ephemeral"
            });
        };

        if (prefix === 'renas') {
            const renas = args[1];

            if (!renas) throw new GenericError('Renas are required.');
            if (!Helpers.isNumber(renas)) throw new GenericError('Renas must be a number.');

            const settings = await SettingsModule.read();

            settings.renas_per_reclaim = Number(renas);
            interaction.client.settings = settings;

            await SettingsModule.save(settings);

            interaction.reply({
                content: "Done.",
                flags: "Ephemeral"
            });
        };

        if (prefix === 'maintenance') {
            let x:any = Number(args[1]);
            
            if (x == 1) x = true;
            else if (x == 0) x = false;
            else x = false;

            interaction.client.settings.maintenance = x;

            await SettingsModule.save(interaction.client.settings);

            interaction.reply({
                flags: "Ephemeral",
                content: 'Done.'
            });
        };
    }
};